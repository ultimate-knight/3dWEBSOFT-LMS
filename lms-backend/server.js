const express=require("express")
const cors=require("cors")
require("dotenv").config()
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {dbConnect}=require("./db/index.js")


const app=express()

const port = process.env.PORT || 9400

app.use(express.json())
app.use(cors())

function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ error: "no token provided" })
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({ error: "no token provided" })
    }

    let decoded
    try {
        decoded = jwt.verify(token, process.env.jwtsecret)
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }

    if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" })
    }

    req.admin = decoded
    next()
}

// Only protect /admin/* APIs — not /adminlogin or /adminregister
app.use((req, res, next) => {
    if (!req.path.startsWith("/admin/")) {
        return next()
    }
    return requireAdmin(req, res, next)
})

app.get("/hello",(req,res)=>{
    res.send("hello brother")
})

// Lightweight wake-up / health check — no DB, fast response once the process is running.
app.get("/health",(req,res)=>{
    res.status(200).json({ ok: true, service: "lms-backend" })
})


// student table
app.post("/register",(req,res)=>{
    const {username,email,password}=req.body;

    const sql1="select * from student where email=?"
    const sql2="insert into student(username,email,password) values(?,?,?)"

    dbConnect.query(sql1,[email],async (error,result)=>{
        if(error){
            return res.status(500).json({message:error.message})
        }

        if(result.length>0){
            return res.status(400).json({message:"you are already registered"})
        }

        const hashed=await bcrypt.hash(password,10)


        dbConnect.query(sql2,[username,email,hashed],(error,result)=>{
            if(error){
                return res.status(500).json({message:error.message})
            }

            const token=jwt.sign(
                {id:result.insertId,name:username,role:"student"},
                process.env.jwtsecret,
                {expiresIn:"7d"}
            )

            return res.json({
                jwtToken:token,
                user:username,
                message:"you are registered successfully",
                studentId:result.insertId,
                credentials:{username,email,password}
            })
        })
    })
})



app.post("/adminregister",(req,res)=>{
    const {username,email,password}=req.body;

    const sql1="select * from adminlogin where email=?"
    const sql2="insert into adminlogin(username,email,password) values(?,?,?)"

    dbConnect.query(sql1,[email],async (error,result)=>{
        if(error){
            return res.status(500).json({message:error.message})
        }

        if(result.length>0){
            return res.status(400).json({message:"you are already registered"})
        }

        const hashed=await bcrypt.hash(password,10)


        dbConnect.query(sql2,[username,email,hashed],(error,result)=>{
            if(error){
                return res.status(500).json({message:error.message})
            }

            const token=jwt.sign(
                {id:result.insertId,name:username,role:"admin"},
                process.env.jwtsecret,
                {expiresIn:"7d"}
            )

            return res.json({
                jwtToken:token,
                user:username,
                message:"you are registered as admin successfully",
                studentId:result.insertId,
                credentials:{username,email,password}
            })
        })
    })
})



app.post("/adminlogin",(req,res)=>{
    const email = String(req.body.email || "").trim().toLowerCase()
    const password = req.body.password

    if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" })
    }

    const sql1="select * from adminlogin where LOWER(email)=?"
    

    dbConnect.query(sql1,[email],async (error,result)=>{
        if(error){
            return res.status(500).json({message:error.message})
        }

        if(result.length===0){
            return res.status(401).json({message:"invalid email or password"})
        }

        const student=result[0]

        const match=await bcrypt.compare(password,student.password)

        if(!match){
            return res.status(401).json({message:"invalid email or password"})
        }

        const token=jwt.sign(
            {id:student.id,name:student.username,role:"admin"},
            process.env.jwtsecret,
            {expiresIn:"7d"}
        )

        return res.json({jwtToken:token,username:student.username,message:"you are logged in successfully"})

      
    })
})





app.post("/login",(req,res)=>{
    const email = String(req.body.email || "").trim().toLowerCase()
    const password = req.body.password

    if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" })
    }

    const sql1="select * from student where LOWER(email)=?"
    

    dbConnect.query(sql1,[email],async (error,result)=>{
        if(error){
            return res.status(500).json({message:error.message})
        }

        if(result.length===0){
            return res.status(401).json({message:"invalid email or password"})
        }

        const student=result[0]

        const match=await bcrypt.compare(password,student.password)

        if(!match){
            return res.status(401).json({message:"invalid email or password"})
        }

        const token=jwt.sign(
            {id:student.id,name:student.username,role:"student"},
            process.env.jwtsecret,
            {expiresIn:"7d"}
        )

        return res.json({jwtToken:token,username:student.username,message:"you are logged in successfully"})

      
    })
})

app.get("/totalusers",(req,res)=>{
    const sql2="select * from student";

    dbConnect.query(sql2,(error,result)=>{
        if(error){
            return res.status(500).json({error:error.message})
        }

        const detailer=result.length

        return res.json({message:"All user data fetched successfully",data:result,detailer})
    })
})
app.get("/me", (req, res) => {

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "no token provided" });
  

  const token = authHeader.split(" ")[1];

  console.log("AUTH HEADER:", token);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.jwtsecret);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  dbConnect.query(
    "SELECT id, username, email FROM student WHERE id = ?",
    [decoded.id],
    (error, result) => {
      if (error) {
        console.log("error",error.message)
        return res.status(500).json({ message: "Server error" })
    }
      if (result.length === 0) return res.status(404).json({ message: "Student not found" });
      return res.json(result[0]);
    }
  );

});


//course table

app.post("/courses",(req,res)=>{
    const {name,description,duration,icon,student_id}=req.body;

    if(!student_id){
        return res.status(400).json({error:"student_id is required — select which student gets this course"})
    }

    const sql3=`insert into course1(name,description,duration,icon) values(?,?,?,?)`

    dbConnect.query(sql3,[name,description,duration,icon],(error,result)=>{
        if(error){
           return res.status(500).json({error:error.message})
        }

        const course_id=result.insertId
        const enrollSql="insert into enrollment(student_id,course_id,pct) values(?,?,0)"

        dbConnect.query(enrollSql,[student_id,course_id],(err2)=>{
            if(err2) return res.status(500).json({error:err2.message})
            return res.json({
                message:"course created and assigned to student successfully",
                data:result,
                course_id,
                student_id
            })
        })
    })
})

app.get("/totalcourses",(req,res)=>{

    const sql2="select * from course1";

    dbConnect.query(sql2,(error,result)=>{
        if(error){
            return res.status(500).json({error:error.message})
        }

        const detailer=result.length

        return res.json({message:"All user data fetched successfully",data:result,detailer})
    })

})

app.post("/enrollment",(req,res)=>{
    const {student_id,course_id}=req.body;

    const checkSql="select * from enrollment where student_id=? and course_id=?"
    dbConnect.query(checkSql,[student_id,course_id],(error,rows)=>{
        if(error) return res.status(500).json({error:error.message})
        if(rows.length>0) return res.status(400).json({error:"student already enrolled in this course"})

        const sql="insert into enrollment(student_id,course_id,pct) values(?,?,0)"
        dbConnect.query(sql,[student_id,course_id],(err,result)=>{
            if(err) return res.status(500).json({error:err.message})
            return res.json({message:"student enrolled successfully",data:result})
        })
    })
})

app.get("/admin/enrollments",(req,res)=>{
    const sql=`SELECT enrollment.id, enrollment.student_id, enrollment.course_id, enrollment.pct, student.username, student.email, course1.name as course_name FROM enrollment JOIN student ON student.id=enrollment.student_id JOIN course1 ON course1.id=enrollment.course_id ORDER BY enrollment.id DESC`
    dbConnect.query(sql,(error,result)=>{
        if(error) return res.status(500).json({error:error.message})
        return res.json({data:result||[]})
    })
})


app.get("/courses",(req,res)=>{

    const authHeader=req.headers.authorization;
    const token=authHeader.split(" ")[1]

    let decoded;

    try {
        decoded=jwt.verify(token,process.env.jwtsecret)

    } catch (error) {
        return res.status(401).json({error:"invalid token"})
    }

    console.log("decoded id from token:", decoded.id);
   

    const sql3=`
SELECT course1.*, enrollment.pct
FROM enrollment
JOIN course1 ON enrollment.course_id = course1.id
WHERE enrollment.student_id = ?;

    `

    dbConnect.query(sql3,[decoded.id],(error,result)=>{
        if(!result){
            return res.status(404).json({error:"no resource found"})
        }

        if(error){
            return res.status(500).json({error:error.message})
        }

        return res.json({message:"course data fetched successfully",data:result})
    })
})


//attendance table

app.post("/attendance",(req,res)=>{
    const {student_id,course_id,Date,status}=req.body;

    const sql3=`insert into aendance(student_id,course_id,Date,status) values(?,?,?,?)`

    dbConnect.query(sql3,[student_id,course_id,Date,status],(error,result)=>{
        if(!result){
            return res.status(404).json({error:"no resource found"})
        }

        if(error){
           return res.status(500).json({error:error.message})
        }

        return res.json({message:"attendance data created successfully",data:result})
    })
})


app.get("/attendance",(req,res)=>{

    const authHeader=req.headers.authorization;
    const token=authHeader.split(" ")[1]

    let decoded;

    try {
        decoded=jwt.verify(token,process.env.jwtsecret)

    } catch (error) {
        return res.status(401).json({error:"invalid token"})
    }

    console.log("decoded id from token:", decoded.id);
   

    const sql3=`
SELECT aendance.student_id,aendance.course_id,aendance.Date,aendance.status,course1.id,course1.name from aendance join course1 on aendance.course_id=course1.id join student on aendance.student_id=student.id where student.id=?;

    `

    dbConnect.query(sql3,[decoded.id],(error,result)=>{
        if(!result){
            return res.status(404).json({error:"no resource found"})
        }

        if(error){
            return res.status(500).json({error:error.message})
        }

        return res.json({message:"attendance data fetched successfully",data:result})
    })
})

app.get("/attendance-present",(req,res)=>{

    const authHeader=req.headers.authorization;
    const token=authHeader.split(" ")[1]

    let decoded;

    try {
        decoded=jwt.verify(token,process.env.jwtsecret)

    } catch (error) {
        return res.status(401).json({error:"invalid token"})
    }

    console.log("decoded id from token:", decoded.id);

    
    let sql2=`select count(status) as total from aendance where status=?`

    dbConnect.query(sql2,["present"],(error,result)=>{
                if(error){
                    return res.status(500).json({message:error.message})
                }

                res.json({data:result,message:"attendance present is shown here"})
    })


})


app.get("/attendance-absent",(req,res)=>{

    const authHeader=req.headers.authorization;
    const token=authHeader.split(" ")[1]

    let decoded;

    try {
        decoded=jwt.verify(token,process.env.jwtsecret)

    } catch (error) {
        return res.status(401).json({error:"invalid token"})
    }

    console.log("decoded id from token:", decoded.id);

    
    let sql2=`select count(status) as total from aendance where status=?`

    dbConnect.query(sql2,["absent",decoded.id],(error,result)=>{
                if(error){
                    return res.status(500).json({message:error.message})
                }

                res.json({data:result,message:"attendance absent is shown here"})
    })


})

//results

app.post("/result",(req,res)=>{
    const {course_id,student_id,assesment,score,grade,status}=req.body;

    const sql="insert into result2(course_id,student_id,assesment,score,grade,status) values(?,?,?,?,?,?)"

    dbConnect.query(sql,[course_id,student_id,assesment,score,grade,status],(error,result)=>{
        if(error){
            return res.status(500).json({error:error.message})
        }

        return res.json({message:"result data added successfully",data:result})
    })
})

app.get("/result",(req,res)=>{
    // const {course_id,student_id,score,grade,status}=req.body;

    const authHeader=req.headers.authorization;
    const token=authHeader.split(" ")[1]

    let decoded;

    try {
        decoded=jwt.verify(token,process.env.jwtsecret)

    } catch (error) {
        return res.status(401).json({error:"invalid token"})
    }

    console.log("decoded id from token:", decoded.id);

    


    const sql="select result2.course_id,result2.student_id,result2.assesment,result2.score,result2.grade,result2.status,course1.name from result2 join course1 on course1.id=result2.course_id join student on student.id=result2.student_id where student.id=?"

    dbConnect.query(sql,[decoded.id],(error,result)=>{
        if(error){
            return res.status(500).json({error:error.message})
        }

        return res.json({message:"result data added successfully",data:result})
    })
})

//exam

app.post("/exam",(req,res)=>{
    const {course_id,questionumbers,duration}=req.body;

    const sql1=`insert into exam1(course_id,questionumbers,duration) values(?,?,?)`

    dbConnect.query(sql1,[course_id,questionumbers,duration],(error,result)=>{
        if(error){
            res.status(500).json({error:error.message})
        }

        res.json({message:"exam data created successfully",data:result})
    })
})


app.get("/exam",(req,res)=>{

    const authHeader=req.headers.authorization;
    const token=authHeader.split(" ")[1]

    let decoded;

    try {
        decoded=jwt.verify(token,process.env.jwtsecret)

    } catch (error) {
        return res.status(401).json({error:"invalid token"})
    }

    console.log("decoded id from token:", decoded.id);

    


    const sql=`select exam1.id,exam1.course_id,exam1.questionumbers,exam1.duration,course1.name from exam1 join course1 on course1.id=exam1.course_id join enrollment on enrollment.course_id=exam1.course_id where enrollment.student_id=?`

    dbConnect.query(sql,[decoded.id],(error,result)=>{
        if(error){
            return res.status(500).json({error:error.message})
        }

        return res.json({message:"exam data added successfully",data:result})
    })


    
})



//questions


app.post("/questions",(req,res)=>{
    const {exam_id,question}=req.body;

    const sql1=`insert into questions(exam_id,question) values(?,?)`;

    dbConnect.query(sql1,[exam_id,question],(error,result)=>{
        if(error){
            res.status(500).json({error:error.message})
        }

        res.json({message:"question data created successfully",data:result})
    })
})



app.get("/questions",(req,res)=>{

    const exam_id = req.query.exam_id

    const authHeader=req.headers.authorization;
    const token=authHeader.split(" ")[1]

    let decoded;

    try {
        decoded=jwt.verify(token,process.env.jwtsecret)

    } catch (error) {
        return res.status(401).json({error:"invalid token"})
    }

    console.log("decoded id from token:", decoded.id);

    


    const sql=`select questions.id,questions.question,questions.exam_id,options.id as options_id,options.choice,options.ischoice from questions left join options on questions.id=options.question_id where questions.exam_id=? order by questions.id`

    dbConnect.query(sql,[exam_id],(error,result)=>{
        if(error){
            return res.status(500).json({error:error.message})
        }

        return res.json({message:"question  data fetched successfully",data:result})
    })


    
})


app.post("/options",(req,res)=>{
    const {question_id,choice,ischoice}=req.body;

    const sql=`insert into options(question_id,choice,ischoice) values(?,?,?)`
    dbConnect.query(sql,[question_id,choice,ischoice?1:0],(error,result)=>{
        if(error) return res.status(500).json({error:error.message})
        return res.json({message:"option created successfully",data:result})
    })
})

//submit

app.post("/submit",(req,res)=>{
    const {exam_id,answers}=req.body;
     const authHeader=req.headers.authorization;
    const token=authHeader.split(" ")[1]

    let decoded;

    try {
        decoded=jwt.verify(token,process.env.jwtsecret)

    } catch (error) {
        return res.status(401).json({error:"invalid token"})
    }

    if(!answers?.length){
        return res.status(400).json({error:"no answers submitted"})
    }

  const pergol=answers.map((a)=>a.options_id)
  const sql1=`select id from options where id in (?) and ischoice=?`

  dbConnect.query(sql1,[pergol,1],(error,result)=>{
    if(error) return res.status(500).json({error:error.message})

    const correct=result.length
    const total=answers.length
    const score=Math.floor((correct/total)*100)
    const grade=score>=95?"A+":score>=90?"A":score>=80?"B":score>=70?"C":score>=60?"D":score>=50?"E":"F"
    const status=score<50?"Fail":"Pass"

    const examSql=`select course_id from exam1 where id=?`
    dbConnect.query(examSql,[exam_id],(err,examRows)=>{
        if(err) return res.status(500).json({error:err.message})
        if(!examRows.length) return res.status(404).json({error:"exam not found"})

        const course_id=examRows[0].course_id
        const sql2=`insert into result2(course_id,student_id,assesment,score,grade,status) values(?,?,?,?,?,?)`

        dbConnect.query(sql2,[course_id,decoded.id,`Exam #${exam_id}`,score,grade,status],(err2)=>{
            if(err2) return res.status(500).json({message:err2.message})
            return res.json({message:"submission data added successfully",score,grade,status,correct,total})
        })
    })
  })

 

  




  




})

//modules

app.post("/modules",(req,res)=>{
    const {course_id,title,position,content}=req.body;

    const sql1="insert into course_module(course_id,title,position,content) values(?,?,?,?)"

    dbConnect.query(sql1,[course_id,title,position,content || ""],(error,result)=>{
        if(error){
            // fallback if content column is missing
            if(String(error.message).toLowerCase().includes("unknown column") && String(error.message).toLowerCase().includes("content")){
                const sqlFallback="insert into course_module(course_id,title,position) values(?,?,?)"
                return dbConnect.query(sqlFallback,[course_id,title,position],(err2,result2)=>{
                    if(err2) return res.status(500).json({error:err2.message})
                    return res.json({message:"module data created successfully (add content column for lesson text)",data:result2})
                })
            }
            return res.status(500).json({error:error.message})
        }

        return res.json({message:"module data created successfully",data:result})
    })
})

app.put("/modules/:id",(req,res)=>{
    const {id}=req.params
    const {title,content}=req.body

    const sql="update course_module set title=COALESCE(?,title), content=? where id=?"
    dbConnect.query(sql,[title || null, content || "", id],(error,result)=>{
        if(error) return res.status(500).json({error:error.message})
        if(result.affectedRows===0) return res.status(404).json({error:"module not found"})
        return res.json({message:"module content updated successfully"})
    })
})

app.get("/modules",(req,res)=>{
    const {course_id}=req.query;
    const authHeader=req.headers.authorization;
    const token=authHeader.split(" ")[1]

    let decoded;

    try {
        decoded=jwt.verify(token,process.env.jwtsecret)

    } catch (error) {
        return res.status(401).json({error:"invalid token"})
    }

    console.log("decoded id from token:", decoded.id);


    const sql2=`SELECT course_module.id, course_module.course_id, course_module.title, course_module.position, course_module.content
FROM course_module
JOIN enrollment ON course_module.course_id = enrollment.course_id
WHERE enrollment.course_id = ? AND enrollment.student_id = ?
ORDER BY course_module.position ASC`

    dbConnect.query(sql2,[course_id,decoded.id],(error,result)=>{
        
        if(error){
            const fallback=`SELECT course_module.id, course_module.course_id, course_module.title, course_module.position
FROM course_module
JOIN enrollment ON course_module.course_id = enrollment.course_id
WHERE enrollment.course_id = ? AND enrollment.student_id = ?
ORDER BY course_module.position ASC`
            return dbConnect.query(fallback,[course_id,decoded.id],(err2,result2)=>{
                if(err2){
                    return res.status(500).json({error:err2.message})
                }
                return res.json({message:"module data fetched successfully",data:result2});
            })
        }

        return res.json({message:"module data fetched successfully",data:result});
    })

})


app.post("/modules/completed",(req,res)=>{
    const {module_id}=req.body

    const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: "no token provided" })
  }
  const token = authHeader.split(" ")[1]
  let decoded
  try {
    decoded = jwt.verify(token, process.env.jwtsecret)
  } catch (error) {
    return res.status(401).json({ error: "invalid token" })
  }

  const sql3=`select course_id from course_module where id=?`

  dbConnect.query(sql3,[module_id],(error,result)=>{
    if(error){
        return res.status(500).json({error:error.message})
    }

    if(result.length===0){
        return res.status(400).json({error:"module not found"})
    }

    const course_id=result[0].course_id

    const checkSql=`select completed from module_progress where module_id=? and student_id=?`

    dbConnect.query(checkSql,[module_id,decoded.id],(error,rows)=>{
        if(error){
            return res.status(500).json({error:error.message})
        }

        if(rows.length>0 && rows[0].completed===1){
            return res.json({message:"already marked done",alreadyDone:true,course_id})
        }

        const sql2=`insert into module_progress(module_id,student_id,completed) values(?,?,1) ON DUPLICATE KEY UPDATE completed=1`

        dbConnect.query(sql2,[module_id,decoded.id],(error)=>{
            if(error){
                return res.status(500).json({error:error.message})
            }

            const updater=`update enrollment set pct=LEAST(pct+5,100) where course_id=? and student_id=?`

            dbConnect.query(updater,[course_id,decoded.id],(error)=>{
                if(error){
                    return res.status(500).json({error:error.message})
                }

                const getPct=`select pct from enrollment where course_id=? and student_id=?`

                dbConnect.query(getPct,[course_id,decoded.id],(error,pctRows)=>{
                    if(error){
                        return res.status(500).json({error:error.message})
                    }

                    if(pctRows.length===0){
                        return res.status(404).json({error:"enrollment not found for this course"})
                    }

                    return res.json({message:"mark done completed",course_id,pct:pctRows[0].pct})
                })
            })
        })
    })
  })
})


app.get("/modules/completed",(req,res)=>{
    const {course_id}=req.query;


    const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: "no token provided" })
  }
  const token = authHeader.split(" ")[1]
  let decoded
  try {
    decoded = jwt.verify(token, process.env.jwtsecret)
  } catch (error) {
    return res.status(401).json({ error: "invalid token" })
  }


    const sql1=`SELECT module_progress.module_id, module_progress.completed, course_module.title
  FROM module_progress
  JOIN course_module ON course_module.id = module_progress.module_id
  JOIN enrollment ON enrollment.course_id = course_module.course_id
                 AND enrollment.student_id = module_progress.student_id
  WHERE module_progress.student_id = ?
    AND course_module.course_id = ?
    AND module_progress.completed = 1`


    dbConnect.query(sql1,[decoded.id,course_id],(error,result)=>{
        if(error){
            return res.status(500).json({error:error.message})
        }

        return res.json({message:"mark done done",data:result})
    })
})









// ensure module content column exists
dbConnect.query("ALTER TABLE course_module ADD COLUMN content TEXT NULL",(err)=>{
    if(err && !String(err.message).toLowerCase().includes("duplicate")){
        console.log("content column check:", err.message)
    }
})

// admin list routes (all records)
app.get("/admin/attendance",(req,res)=>{
    const sql=`SELECT aendance.student_id,aendance.course_id,aendance.Date,aendance.status,course1.name as course_name,student.username FROM aendance LEFT JOIN course1 ON aendance.course_id=course1.id LEFT JOIN student ON aendance.student_id=student.id`
    dbConnect.query(sql,(error,result)=>{
        if(error) return res.status(500).json({error:error.message})
        return res.json({data:result || []})
    })
})

app.get("/admin/results",(req,res)=>{
    const sql=`SELECT result2.*,course1.name as course_name,student.username FROM result2 LEFT JOIN course1 ON course1.id=result2.course_id LEFT JOIN student ON student.id=result2.student_id`
    dbConnect.query(sql,(error,result)=>{
        if(error) return res.status(500).json({error:error.message})
        return res.json({data:result || []})
    })
})

app.get("/admin/exams",(req,res)=>{
    const sql=`SELECT exam1.*,course1.name as course_name FROM exam1 LEFT JOIN course1 ON course1.id=exam1.course_id`
    dbConnect.query(sql,(error,result)=>{
        if(error) return res.status(500).json({error:error.message})
        return res.json({data:result || []})
    })
})

app.get("/admin/modules",(req,res)=>{
    const sql=`SELECT course_module.id, course_module.course_id, course_module.title, course_module.position, course_module.content, course1.name as course_name FROM course_module LEFT JOIN course1 ON course1.id=course_module.course_id ORDER BY course_module.course_id, course_module.position`
    dbConnect.query(sql,(error,result)=>{
        if(error){
            // older schema without content
            const fallback=`SELECT course_module.id, course_module.course_id, course_module.title, course_module.position, course1.name as course_name FROM course_module LEFT JOIN course1 ON course1.id=course_module.course_id ORDER BY course_module.course_id, course_module.position`
            return dbConnect.query(fallback,(err2,result2)=>{
                if(err2) return res.status(500).json({error:err2.message})
                return res.json({data:result2 || []})
            })
        }
        return res.json({data:result || []})
    })
})

app.get("/admin/questions",(req,res)=>{
    const sql=`SELECT questions.*,exam1.course_id FROM questions LEFT JOIN exam1 ON exam1.id=questions.exam_id`
    dbConnect.query(sql,(error,result)=>{
        if(error) return res.status(500).json({error:error.message})
        return res.json({data:result || []})
    })
})

app.get("/admin/options",(req,res)=>{
    const sql=`SELECT options.*,questions.question FROM options LEFT JOIN questions ON questions.id=options.question_id`
    dbConnect.query(sql,(error,result)=>{
        if(error) return res.status(500).json({error:error.message})
        return res.json({data:result || []})
    })
})

// admin delete routes
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        dbConnect.query(sql, params, (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

app.delete("/admin/students/:id", async (req, res) => {
    const { id } = req.params
    try {
        await runQuery("DELETE FROM module_progress WHERE student_id=?", [id])
        await runQuery("DELETE FROM enrollment WHERE student_id=?", [id])
        await runQuery("DELETE FROM aendance WHERE student_id=?", [id])
        await runQuery("DELETE FROM result2 WHERE student_id=?", [id])
        const result = await runQuery("DELETE FROM student WHERE id=?", [id])
        if (result.affectedRows === 0) return res.status(404).json({ error: "student not found" })
        return res.json({ message: "student deleted successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.delete("/admin/courses/:id", async (req, res) => {
    const { id } = req.params
    try {
        const exams = await runQuery("SELECT id FROM exam1 WHERE course_id=?", [id])
        for (const exam of exams) {
            const questions = await runQuery("SELECT id FROM questions WHERE exam_id=?", [exam.id])
            for (const q of questions) {
                await runQuery("DELETE FROM options WHERE question_id=?", [q.id])
            }
            await runQuery("DELETE FROM questions WHERE exam_id=?", [exam.id])
        }
        await runQuery("DELETE FROM exam1 WHERE course_id=?", [id])
        const modules = await runQuery("SELECT id FROM course_module WHERE course_id=?", [id])
        for (const mod of modules) {
            await runQuery("DELETE FROM module_progress WHERE module_id=?", [mod.id])
        }
        await runQuery("DELETE FROM course_module WHERE course_id=?", [id])
        await runQuery("DELETE FROM enrollment WHERE course_id=?", [id])
        await runQuery("DELETE FROM aendance WHERE course_id=?", [id])
        await runQuery("DELETE FROM result2 WHERE course_id=?", [id])
        const result = await runQuery("DELETE FROM course1 WHERE id=?", [id])
        if (result.affectedRows === 0) return res.status(404).json({ error: "course not found" })
        return res.json({ message: "course deleted successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.delete("/admin/enrollments/:id", async (req, res) => {
    const { id } = req.params
    try {
        const result = await runQuery("DELETE FROM enrollment WHERE id=?", [id])
        if (result.affectedRows === 0) return res.status(404).json({ error: "enrollment not found" })
        return res.json({ message: "enrollment removed successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.delete("/admin/attendance", async (req, res) => {
    const { student_id, course_id, Date: attDate } = req.body
    if (!student_id || !course_id || !attDate) {
        return res.status(400).json({ error: "student_id, course_id, and Date are required" })
    }
    try {
        const result = await runQuery(
            "DELETE FROM aendance WHERE student_id=? AND course_id=? AND Date=?",
            [student_id, course_id, attDate]
        )
        if (result.affectedRows === 0) return res.status(404).json({ error: "attendance record not found" })
        return res.json({ message: "attendance record deleted successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.delete("/admin/results/:id", async (req, res) => {
    const { id } = req.params
    try {
        const result = await runQuery("DELETE FROM result2 WHERE id=?", [id])
        if (result.affectedRows === 0) return res.status(404).json({ error: "result not found" })
        return res.json({ message: "result deleted successfully" })
    } catch (error) {
        if (String(error.message).toLowerCase().includes("unknown column")) {
            return res.status(400).json({ error: "use composite delete for results" })
        }
        return res.status(500).json({ error: error.message })
    }
})

app.delete("/admin/results", async (req, res) => {
    const { course_id, student_id, assesment, score } = req.body
    if (!course_id || !student_id || !assesment) {
        return res.status(400).json({ error: "course_id, student_id, and assesment are required" })
    }
    try {
        const result = await runQuery(
            "DELETE FROM result2 WHERE course_id=? AND student_id=? AND assesment=? AND score=?",
            [course_id, student_id, assesment, score ?? 0]
        )
        if (result.affectedRows === 0) return res.status(404).json({ error: "result not found" })
        return res.json({ message: "result deleted successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.delete("/admin/exams/:id", async (req, res) => {
    const { id } = req.params
    try {
        const questions = await runQuery("SELECT id FROM questions WHERE exam_id=?", [id])
        for (const q of questions) {
            await runQuery("DELETE FROM options WHERE question_id=?", [q.id])
        }
        await runQuery("DELETE FROM questions WHERE exam_id=?", [id])
        const result = await runQuery("DELETE FROM exam1 WHERE id=?", [id])
        if (result.affectedRows === 0) return res.status(404).json({ error: "exam not found" })
        return res.json({ message: "exam deleted successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.delete("/admin/questions/:id", async (req, res) => {
    const { id } = req.params
    try {
        await runQuery("DELETE FROM options WHERE question_id=?", [id])
        const result = await runQuery("DELETE FROM questions WHERE id=?", [id])
        if (result.affectedRows === 0) return res.status(404).json({ error: "question not found" })
        return res.json({ message: "question deleted successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.delete("/admin/options/:id", async (req, res) => {
    const { id } = req.params
    try {
        const result = await runQuery("DELETE FROM options WHERE id=?", [id])
        if (result.affectedRows === 0) return res.status(404).json({ error: "option not found" })
        return res.json({ message: "option deleted successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.delete("/admin/modules/:id", async (req, res) => {
    const { id } = req.params
    try {
        await runQuery("DELETE FROM module_progress WHERE module_id=?", [id])
        const result = await runQuery("DELETE FROM course_module WHERE id=?", [id])
        if (result.affectedRows === 0) return res.status(404).json({ error: "module not found" })
        return res.json({ message: "module deleted successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

const server = app.listen(port, "0.0.0.0",()=>{
    console.log(`server is running on port ${port}`)
})

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use. Kill the old server first:`)
        console.error(`  lsof -i :${port}`)
        console.error(`  kill <PID>`)
        process.exit(1)
    }
    console.error(err)
    process.exit(1)
})