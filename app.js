const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
// const request = require("request");

//give the app all functionalities of express
const app = express();

/*since our style.css and our images are local
the server treat them as static
for order to let our server display them we need a function from express
inside the public folder we keep our static files*/
app.use(express.static("public"));

/* for order to post the inputs from our signup form
we need the body-parser */
app.use(bodyParser.urlencoded({ extended: true }));

//connect app to our browser
app.get("/", (res) => {
  res.sendFile(__dirname + "/signup.html", (err) => console.error(err));
});

//post method
app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  //console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  //our mailchimp need a json format
  const jsonData = JSON.stringify(data);

  //made a request
  //https.request(url, option, callback);
  const url = "https://us17.api.mailchimp.com/3.0/lists/c5539c7de2";
  const options = {
    method: "POST",
    auth: "mayouma : 2a90aa35c14d076fc49719c4b507dd4a-us17",
  };
  //on order to send our jsonData we need to recuper the request
  const request = https.request(url, options, (response) => {
    response.on("data", (data) => console.log(JSON.parse(data)));
    //we need the status code in order to send the right message
    response.statusCode === 200
      ? res.sendFile(__dirname + "/success.html")
      : res.sendFile(__dirname + "/failure.html");
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (res) => {
  res.redirect("/");
});

//give our app a port listener
// app.listen(3001, () => console.log("the server is runing on port 3001"));

//in order to deploy our app we need an external port
//listen on 2 ports ||
app.listen(process.env.PORT || 3000, () =>
  console.log("the server is runing on port 3001")
);

//mailchimp api key
//2a90aa35c14d076fc49719c4b507dd4a-us17

//list id
//c5539c7de2
