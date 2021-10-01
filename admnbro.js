var express = require('express');
const AdminBro = require('admin-bro')
const AdminBroSequelize = require('@admin-bro/sequelize')
// const AdminBroExpress = require('@admin-bro/express')
const AdminBroExpressjs = require("admin-bro-expressjs");
var app = express();
const bcrypt = require('bcrypt');


const { User, Goal } = require("../models/user");
// const db = require("../config/database");
const { Products, Categories, Orders, RedeemCode } = require('../models/shop');
const { Faq } = require('../models/extras');
const { Courses } = require('../models/courses');
const { Exams, ExamJson, Results, UserAttemptedExam, PickOfTheDay, PickOfTheDayResults } = require('../models/tests');
const { Subscription, SubscriptionType } = require('../models/subscription');
// const { default: Dashboard } = require('./my-dashboard-component.jsx');

AdminBro.registerAdapter(AdminBroSequelize)
const AdminBroOptions = {
    // databases: [db],
    branding: {
        companyName: 'The Science Odyssey',
        softwareBrothers: false,
        logo: 'https://firebasestorage.googleapis.com/v0/b/crack-the-odyssey.appspot.com/o/logo.png?alt=media&token=7cf2d0d1-6fd4-48ec-888b-1799ece398e2',
        favicon: 'https://firebasestorage.googleapis.com/v0/b/crack-the-odyssey.appspot.com/o/logo.png?alt=media&token=7cf2d0d1-6fd4-48ec-888b-1799ece398e2'
    },

    resources:
        [
            {
                resource: Products,
                // features: [uploadFeature({
                //     provider: { gcp: { bucket: process.env.IMAGE_BUCKET, expires: 0, } },
                //     properties: {
                //         key: 'fileUrl', // to this db field feature will safe S3 key
                //         mimeType: 'mimeType' // this property is important because allows to have previews
                //     },
                // })]
            },
            { resource: Courses },
            // { resource: OrderItems },
            { resource: RedeemCode },
            { resource: Categories },
            { resource: UserAttemptedExam },
            { resource: Orders },
            { resource: Faq },
            { resource: Goal },
            { resource: Exams },
            { resource: ExamJson },
            { resource: Results },
            { resource: Subscription },
            { resource: SubscriptionType },
            { resource: PickOfTheDay },
            { resource: PickOfTheDayResults },
            {
                resource: User,
                options: {
                    properties: {
                        password: { isVisible: false },
                        password: {
                            type: 'string',
                            isVisible: {
                                list: false, edit: true, filter: false, show: false,
                            },
                        },
                        // image: {
                        //     isVisible: {
                        //         list: false,
                        //         show: true,
                        //         edit: true,
                        //     }
                        // },
                        createdAt: { isVisible: false },
                        updatedAt: { isVisible: false },
                    },
                    actions: {
                        new: {
                            before: async (request) => {
                                if (request.payload.record.password) {
                                    request.payload.record = {
                                        ...request.payload.record,
                                        password:
                                            bcrypt.hashSync(request.payload.record.password, 10, null)
                                        // password: undefined,
                                    }
                                }
                                return request
                            },
                        },
                        // edit: { isAccessible: canModifyUsers },
                        // delete: { isAccessible: canModifyUsers },
                        // new: { isAccessible: canModifyUsers },
                    }
                }
            }],
    // dashboard: {
    //     handler: async () => {
    //         return { some: 'output' }
    //     },

    //     component: AdminBro.bundle('./my-dashboard-component.jsx'),

    // }
}
const adminBro = new AdminBro(AdminBroOptions)
const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {

    authenticate: async (email, password) => {
        const user = await User.findOne({
            where: {
                email: email,
            }
        })

        if (user) {
            try {
                // console.log(user.role);
                if (user.role !== 3) {
                    return false;
                }

                if (bcrypt.compareSync(password, user.password)) {
                    return user
                }
            } catch (error) {
                // console.log(error);
            }
        }
        return false
    },
    cookiePassword: 'session Key',

},

)

module.exports = router;