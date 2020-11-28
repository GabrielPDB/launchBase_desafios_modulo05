const Intl = require('intl')
const { age, class_type, date, education_level, grade } = require('../../lib/utils')
const Student = require('../models/Student')


module.exports = {
    index(req, res) {

        Student.all(function (students) {
            students = students.map(function (student) {
                return {
                    ...student,
                    school_year: grade(student.school_year)
                }
            })

            return res.render('students/index', { students })
        })

    },
    create(req, res) {
        Student.teachersSelectOptions(function (options) {

            return res.render('students/create', { teacherOptions: options })
        })
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        // Validação
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }

        Student.create(req.body, function (student) {
            return res.redirect(`/students/${student.id}`)
        })

    },
    show(req, res) {
        Student.find(req.params.id, function (student) {
            if (!student) return res.send('Student not found!')

            student.birth_date = date(student.birth_date).birthDay
            student.school_year = grade(student.school_year)

            return res.render('students/show', { student })
        })
    },
    edit(req, res) {
        Student.find(req.params.id, function (student) {
            if (!student) return res.send('Student not found!')

            student.birth_date = date(student.birth_date).iso

            Student.teachersSelectOptions(function (options) {
                return res.render('students/edit', { student, teacherOptions: options })
            })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        // Validação
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }

        Student.update(req.body, function () {
            return res.redirect(`/students/${req.body.id}`)
        })
    },
    delete(req, res) {
        Student.delete(req.body.id, function () {
            return res.redirect(`/students`)
        })
    }
}