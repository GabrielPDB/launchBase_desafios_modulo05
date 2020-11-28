const Intl = require('intl')
const { age, graduation, class_type, date, education_level } = require('../../lib/utils')
const Teacher = require('../models/Teacher')


module.exports = {
    index(req, res) {

        Teacher.all(function (teachers) {
            teachers = teachers.map(function (teacher) {
                return {
                    ...teacher,
                    subjects_taugh: teacher.subjects_taugh.split(',')
                }
            })

            return res.render('teachers/index', { teachers })
        })

    },
    create(req, res) {
        return res.render('teachers/create')
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        // Validação
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }

        Teacher.create(req.body, function (teacher) {
            return res.redirect(`/teachers/${teacher.id}`)
        })

    },
    show(req, res) {
        Teacher.find(req.params.id, function (teacher) {
            if (!teacher) return res.send('Teacher not found!')

            teacher.age = age(teacher.birth_date)
            teacher.education_level = education_level(teacher.education_level)
            teacher.class_type = class_type(teacher.class_type)
            teacher.subjects_taugh = teacher.subjects_taugh.split(',')

            teacher.created_at = date(teacher.created_at).format

            return res.render('teachers/show', { teacher })
        })
    },
    edit(req, res) {
        Teacher.find(req.params.id, function (teacher) {
            if (!teacher) return res.send('Teacher not found!')

            teacher.birth_date = date(teacher.birth_date).iso

            return res.render('teachers/edit', { teacher })
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

        Teacher.update(req.body, function() {
            return res.redirect(`/teachers/${req.body.id}`)
        })
    },
    delete(req, res) {
        Teacher.delete(req.body.id, function() {
            return res.redirect(`/teachers`)
        })
    }
}