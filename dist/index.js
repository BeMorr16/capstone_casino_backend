var i=(e,s)=>()=>(s||e((s={exports:{}}).exports,s),s.exports);var u=i((is,I)=>{var O=require("express"),X=O(),Z=require("bcrypt"),ee=require("jsonwebtoken"),se=require("uuid"),re=require("pg");require("dotenv").config();var te=new re.Client({connectionString:process.env.DATABASE_URL||"postgres://localhost/casino_capstone",ssl:{rejectUnauthorized:!1}});I.exports={express:O,app:X,bcrypt:Z,jwt:ee,uuid:se,client:te}});var R=i((cs,U)=>{var{jwt:f,bcrypt:S,client:g,uuid:oe}=u(),L=process.env.JWT||"sshhh";async function ne(e){let{username:s,email:t,password:r,mode:o}=e,n=await S.hash(r,10),a,c;o===1?(a=1e4,c=5e4):o===2?(a=5e3,c=5e4):o===3?(a=1e3,c=5e4):(a=100,c=5e4);let y=!1;(t==="bemorrison16@gmail.com"||t==="davidtoelle54@gmail.com"||t==="josehumberto2002@gmail.com")&&(y=!0);let h=await g.query(`
    INSERT INTO users(id, username, email, password, user_money, goal, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,[oe.v4(),s,t,n,a,c,y]),p=await f.sign({id:h.rows[0].id},L,{expiresIn:"1h"});return{...h.rows[0],token:p}}async function ae(e){let{username:s,password:t}=e,o=await g.query(`
    SELECT * FROM users WHERE username=$1;`,[s]);if(!o.rows.length||await S.compare(t,o.rows[0].password)===!1){let a=Error("Invalid username and/or password");throw a.status=401,a}let n=await f.sign({id:o.rows[0].id},L,{expiresIn:"1h"});return{...o.rows[0],token:n}}async function ie(e){let s;try{s=(await f.verify(e,L)).id}catch{let n=Error("Not authorized");throw n.status=401,n}let r=await g.query(`
    SELECT id, username FROM users WHERE id=$1;`,[s]);if(!r.rows.length){let o=Error("Not authorized");throw o.status=401,o}return r.rows[0]}async function ce(e){let t=await g.query(`
    SELECT * FROM users WHERE id=$1;`,[e]);if(!t.rows.length){let r=Error("No user found");throw r.status=401,r}return t.rows[0]}async function ue(e){let{id:s,username:t,email:r,password:o,user_money:n,wins:a,losses:c}=e;if(!s){let E=new Error("User ID is required in body to edit");throw E.status=400,E}let y=o?await S.hash(o,10):null,d=[t||null,r||null,o?y:null,n||null,a||null,c||null,s],p=await g.query(`
    UPDATE users
    SET
    username = COALESCE($1, username),
    email = COALESCE($2, email),
    password = COALESCE($3, password),
    user_money = COALESCE(user_money, 0) + COALESCE($4, 0),
    wins = COALESCE(wins, 0) + COALESCE($5, 0),
    losses = COALESCE(losses, 0) + COALESCE($6, 0)
    WHERE id=$7
    RETURNING *;`,d);if(!p.rows.length){let E=new Error("No user found");throw E.status=404,E}return p.rows[0]}U.exports={registerQuery:ne,loginQuery:ae,findUserWithToken:ie,getUserInfoQuery:ce,editUserQuery:ue}});var Q=i((us,_)=>{var{findUserWithToken:de}=R();async function le(e,s,t){try{let o=e.headers.authorization.split(" ")[1];e.user=await de(o),t()}catch(r){t(r)}}_.exports={isLoggedIn:le}});var q=i((ds,A)=>{var{registerQuery:ye,loginQuery:we,getUserInfoQuery:Ee,editUserQuery:ge}=R();async function pe(e,s,t){try{let r=await ye(e.body);s.status(201).json(r)}catch(r){t(r)}}async function me(e,s,t){try{let r=await we(e.body);s.status(200).json(r)}catch(r){t(r)}}async function he(e,s,t){let r=e.user.id;try{let o=await Ee(r);s.status(200).json(o)}catch(o){t(o)}}async function fe(e,s,t){try{let r=await ge(e.body);s.status(201).json(r)}catch(r){t(r)}}A.exports={register:pe,login:me,getUserInfo:he,editUser:fe}});var N=i((ls,x)=>{var{express:Se}=u(),w=Se.Router(),{register:Le,login:Re,getUserInfo:Qe,editUser:qe}=q(),{isLoggedIn:C}=Q();w.post("/register",Le);w.post("/login",Re);w.get("/auth",C,async(e,s,t)=>{try{s.send(e.user)}catch(r){t(r)}});w.get("/",C,Qe);w.put("/edit",C,qe);x.exports=w});var M=i((ys,H)=>{var{client:m,uuid:Ce}=u();async function Te(e){let{id:s,game:t,win_loss:r,money:o,result:n}=e;if(!s||!t||r===void 0||!o||!n){let d=new Error("Missing required fields");throw d.status=400,d}let a=` INSERT INTO transactions (transaction_id, user_id, game, win_loss, money, result)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;`,c=[Ce.v4(),s,t,r,o,n],y=await m.query(a,c);if(!y.rows.length){let d=new Error("Transaction could not be added");throw d.status=500,d}return y.rows[0]}async function $e(e,s){return await m.query(`
        SELECT * FROM transactions 
        WHERE user_id=$1 AND win_loss=$2;`,[e,s])}async function be(e){return await m.query("SELECT * FROM transactions WHERE user_id = $1;",[e])}async function Oe(e,s,t=null){let r,o;return t!==null?(r=`
            SELECT * FROM transactions 
            WHERE user_id=$1 AND game=$2 AND win_loss=$3;`,o=[s,e,t]):(r=`
            SELECT * FROM transactions 
            WHERE user_id=$1 AND game=$2;`,o=[s,e]),await m.query(r,o)}H.exports={addTransactionQuery:Te,getFilteredHistoryQuery:$e,getAllHistoryQuery:be,getSingleCategoryHistoryQuery:Oe}});var j=i((ws,D)=>{var{getAllHistoryQuery:Ie,getSingleCategoryHistoryQuery:W,addTransactionQuery:Ue,getFilteredHistoryQuery:_e}=M();async function Ae(e,s,t){try{let r=await Ue(e.body);s.status(201).json(r)}catch(r){t(r)}}async function xe(e,s,t){try{let{game:r,win_loss:o}=e.params,n;r==="all"?o!==void 0?n=await _e(e.user.id,o):n=await Ie(e.user.id):o!==void 0?n=await W(r,e.user.id,o):n=await W(r,e.user.id),s.status(200).json(n.rows)}catch(r){t(r)}}D.exports={addTransaction:Ae,getHistory:xe}});var B=i((Es,F)=>{var{getHistory:Ne,addTransaction:He}=j(),{editUser:Me}=q(),{express:We}=u(),T=We.Router();T.post("/add",He,Me);T.get("/history/:game/:win_loss?",Ne);F.exports=T});var P=i((gs,v)=>{var{client:$}=u();async function De(){try{return(await $.query(`
        SELECT * 
        FROM transactions
        WHERE win_loss = true
        ORDER BY money DESC
        LIMIT 10;`)).rows}catch(e){let s=new Error("Error fetching biggest wins: "+e.message);throw s.status=500,s}}async function je(){let e=`
    SELECT username, wins, loss,
           (CASE WHEN wins + loss > 0 THEN 
               ROUND((wins * 100.0 / (wins + loss)), 2)
            ELSE 0
            END) AS win_percentage
    FROM users
    ORDER BY wins DESC
    LIMIT 5;`;try{return(await $.query(e)).rows}catch(s){let t=new Error("Error fetching best records: "+s.message);throw t.status=500,t}}async function Fe(){try{return(await $.query(`
        SELECT username, user_money
        FROM users WHERE is_admin = false
        ORDER BY user_money DESC
        LIMIT 5;`)).rows}catch(e){let s=new Error("Error fetching most money leaders: "+e.message);throw s.status=500,s}}v.exports={getBiggestWinsQuery:De,getBestRecordQuery:je,getMostMoneyQuery:Fe}});var z=i((ps,k)=>{var{getBiggestWinsQuery:Be,getBestRecordQuery:ve,getMostMoneyQuery:Pe}=P();async function ke(e,s,t){try{let r=await Be();s.status(200).json(r)}catch(r){t(r)}}async function ze(e,s,t){try{let{record:r}=e.params;if(r==="record"){let o=await ve();s.status(200).json(o)}else{let o=await Pe();s.status(200).json(o)}}catch(r){t(r)}}k.exports={getBiggestWins:ke,getUserLeaderboards:ze}});var Y=i((ms,G)=>{var{getBiggestWins:Ge,getUserLeaderboards:Ye}=z(),{express:Je}=u(),b=Je.Router();b.get("/transaction",Ge);b.get("/user/:record?",Ye);G.exports=b});var K=i((hs,V)=>{var{express:Ve}=u(),J=Ve.Router();J.get("/number",async(e,s)=>{let o=Math.floor(Math.random()*37)+0;s.status(200).json(o)});V.exports=J});var{app:l,express:Ke,client:Xe}=u(),{isLoggedIn:Ze}=Q(),es=require("cors");l.use(Ke.json());l.use(es());var ss=N(),rs=B(),ts=Y(),os=K();l.use("/user",ss);l.use("/transaction",Ze,rs);l.use("/leaderboard",ts);l.use("/roulette",os);l.use((e,s,t,r)=>{console.log(e),t.status(e.status||500).send({error:e.message?e.message:e})});async function ns(){let e=process.env.PORT||8080;await Xe.connect(),console.log("connected to DB"),l.listen(e,()=>{console.log(`Listening on Port ${e}...`)})}ns();
//# sourceMappingURL=index.js.map
