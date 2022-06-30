const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const multer = require("multer");
const nodemailer = require("nodemailer");

/* defined storage and filename */
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files/IMG')
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, 'IMG_' + Date.now() + ext)
    }
})

/* defined filter */
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype === "application/msword"
    ) {
        cb(null, true);
    } else {
        cb(new Error("File format should be pdf,doc,docx"), false);
    }
};

var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fieldSize: 25 * 1024 * 1024
    }
});

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.post('/user', getusers);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.get('/getByUsername/:username', getByUsername)
router.put('/edit/:id', upload.single('IMG'), update);
router.delete('/:id', _delete);
router.post('/role', getRole);
router.post('/resetPassword', resetPassword);
router.post('/confirmPassword', confirmPassword)
router.post('/frndRequest', frndRequest)
router.post('/updateAddFriend', updateAddFriend)
router.post('/checkUsername', checkUsernameC)

module.exports = router;
const user = 'verify@chorusx.social'
const pass = 'VerVer444$$'
const frontendURL = process.env.frontend || 'https://chorusx.herokuapp.com/'

function sendConfirmationEmail(username, email, confirmationCode, password) {
    const transport = nodemailer.createTransport({
        //host: "smtp.gmail.com",
        host: "mail.privateemail.com",
        port: 465,
        secure: true,
        auth: {
            user: user,
            pass: pass
        }
    });
    console.log(`<a href=https://chorusx.herokuapp.com/#/login/${confirmationCode}> Click here</a>`);
    transport.sendMail({
        from: user,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
          <h2>Hello ${username}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=${frontendURL}/#/login/${confirmationCode}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
}

function sendResetPasswordEmail(email) {
    const transport = nodemailer.createTransport({
        //host: "smtp.gmail.com",
        host: "mail.privateemail.com",
        port: 465,
        secure: true,
        auth: {
            user: user,
            pass: pass
        }
    });
    transport.sendMail({
        from: user,
        to: email,
        subject: "Reset Password",
        html: `<h1>Reset Password</h1>
            <p>Reset your password by clicking on the following link</p>
          <a href=${frontendURL}/#/resetpassword/${email}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
}

function sendFriendReqStatus(email, name, friend_req_status) {
    const transport = nodemailer.createTransport({
        //host: "smtp.gmail.com",
        host: "mail.privateemail.com",
        port: 465,
        secure: true,
        auth: {
            user: user,
            pass: pass
        }
    });
    transport.sendMail({
        from: user,
        to: email,
        subject: "Friend Request Confirmation",
        html: `<h1>Friend Request Confirmation</h1>
            <h2>Hello ${name}</h2>
                <p>Your friend request has been ${friend_req_status}.</p>`,
    }).catch(err => console.log(err));


}


function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => {
            //user ? res.json(user) : res.status(400).json({
            //    message: 'Username or password is incorrect'
            //})
            if (user) {
                if (user.status != "Active") {
                    return res.status(401).send({
                        message: "User was registered successfully. Please check your email.",
                    });
                } else if (user.status == "Active") {
                    return res.status(200).send(user);
                }
            } else if (!user) {
                return res.status(400).send({
                    message: "Username or password is incorrect",
                });
            }

        })
        .catch(err => next(err));
}

function frndRequest(req, res, next) {
    let userParam = req.body
    userService.frndRequest(userParam).then((data) => {
        if (data) {
            const firstname = data.firstname.charAt(0).toUpperCase()+ data.firstname.slice(1)
            const lastname = data.lastname.charAt(0).toUpperCase()+ data.lastname.slice(1)
            let name = firstname + ' ' + lastname
            sendFriendReqStatus(data.email, name, data.friend_req_status)
            return res.status(200).send({
                user: data,
                message: "Friend Request has been " + data.friend_req_status + " successfully!!",
            });
        }
    }).catch(err => next(err))
}

function checkUsernameC(req, res, next) {
    userService.checkUsername(req.body)
        .then((data) => {
            return res.status(200).send({
                data,
                message: true,
            });
        })
        .catch(err => {
            res.status(500).send(err)
        });
}

function register(req, res, next) {
    userService.create(req.body)
        .then((data) => {

            const firstname = data.firstname.charAt(0).toUpperCase()+ data.firstname.slice(1)
            const lastname = data.lastname.charAt(0).toUpperCase()+ data.lastname.slice(1)
            let username = firstname + ' ' + lastname

            sendConfirmationEmail(
                username,
                data.email,
                data.confirmationCode,
                data.chash
            );

            //res.json({})
            return res.status(200).send({
                data,
                message: "Thank you for registration. Please login by clicking on the link send on your registered email",
            });
        })
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}


function getusers(req, res, next) {
    userService.getusers(req.body)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getRole(req, res, next) {
    userService.getRole(req.body)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function resetPassword(req, res, next) {
    if (req.body.email != '') {
        userService.resetPassword(req.body).then(users => {
            if (users) {
                sendResetPasswordEmail(req.body.email)
                return res.status(200).send({
                    message: "Please reset your password by clicking on the link send on your registered email",
                });
            }
        }).catch(err => next(err));

    } else if (req.body.email == '') {
        return res.status(400).send({
            message: "Please enter the Email!!",
        });
    }

}

function confirmPassword(req, res, next) {
    userService.confirmPassword(req.body).then(user => {
        if (user) {
            return res.status(200).send({
                user,
                message: "Your password reset successfully"
            });

        } else if (!user) {
            return res.status(400).send({
                message: "Please register the email first!!",
            });
        }
    }).catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByUsername(req, res, next) {
    userService.getByUsername(req.params.username)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function updateAddFriend(req, res, next) {
    userService.updateAddFriend(req.body)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
function update(req, res, next) {
    let obj = req.body;
    const role = req.body.role && JSON.parse(req.body.role)
    if (role) obj = { ...req.body, role};
    userService.update(req.params.id, obj)
        .then(() => res.json({}))
        .catch(err => next(err));
}


function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
