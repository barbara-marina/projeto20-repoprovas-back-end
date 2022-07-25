import { Test } from "@prisma/client";
import prisma from "../config/database.js";

export type testData = (Omit<Test, "id" | "createdAt">);

async function findCategory(category: string) {
    return await prisma.category.findUnique({
        where: {
            name: category
        }
    });
}

async function findDiscipline(discipline: string) {
    return await prisma.discipline.findUnique({
        where: {
            name: discipline
        }
    });
}

async function findTeacher(teacher: string) {
    return await prisma.teacher.findUnique({
        where: {
            name: teacher
        }
    });
}

async function findTeacherDiscipline(teacherId: number, disciplineId: number) {
    return await prisma.teacherDiscipline.findFirst({
        where: {
            teacherId,
            disciplineId
        }
    });
}

async function insertTest(test : testData) {
    await prisma.test.create({
        data: test
    });
    
}

async function groupByTestsByDisciplines() {
    return await prisma.term.findMany({
        include: {
            disciplines: {
                include: {
                    teachersDisciplines:{
                        include: {
                            test: {
                                include: {
                                    category: true,
                                }
                            },
                            teacher: true
                        }
                    }
                }
            }
        }
    });
}

async function groupByTestsByTeachers() {
    return await prisma.teacher.findMany({
        include: {
            teachersDisciplines: {
                include: {
                    test: {
                        include: {
                            category: true
                        }
                    }
                }
            }
        }
    });
}

async function findTestsById(id: number) {
    return await prisma.test.findUnique({
        where: {
            id
        }
    });
}

const testRepository = {
    findCategory,
    findDiscipline, 
    findTeacher,
    findTeacherDiscipline,
    insertTest,
    groupByTestsByDisciplines,
    groupByTestsByTeachers,
    findTestsById
};

export default testRepository;