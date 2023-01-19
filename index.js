const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dbConnect = require("./db");
const UserModel = require("./src/model/user");
const jwt =require("jsonwebtoken")



require("dotenv").config()
const PORT = process.env.PORT ;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
	res.send("welcome home")
})

app.use(cors())
//sign up request

app.post("/signup", async (req, res) => {
	const { password } = req.body;
	bcrypt.hash(password, 6).then(async function (hash) {
		const new_user = new UserModel({ ...req.body, password: hash })
		await new_user.save();
		res.json({msg:"sign up successful"})
	})
		.catch(err => {
			res.send("something went wrong")
		})
})

app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const user = await UserModel.findOne({ email });
	const hash = user.password;
	bcrypt.compare(password, hash, function (err, result) {
		if (result) {
			const token = jwt.sign({ userId:user._id }, "passkey");
			res.json({msg:"login successfull",token:token})
		} else res.json({msg:"Invalid Credentials"})

	})

})


app.listen(PORT || 6000, () => {
  dbConnect();
  console.log(`Server started on port ${PORT}`);
});