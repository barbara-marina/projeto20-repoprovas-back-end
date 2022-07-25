
import errorHandler from "../middlewares/errorMiddleware.js";

import testRepository, { testData } from "../repositories/testRepository.js";

export type newTest = {
    name: string;
    pdfUrl: string;
    category: string; 
    discipline: string; 
    teacher: string;
}

async function createTest({name, pdfUrl, category, discipline, teacher}: newTest) {
    const categoryId = await verifyExistingCategory(category);
    const teacherDisciplineId = await getTeacherDiscipline(discipline, teacher);

    await testRepository.insertTest({name, pdfUrl, categoryId, teacherDisciplineId});
}

async function verifyExistingCategory(category: string) {
    const isCategoryValid = await testRepository.findCategory(category);
    if (!isCategoryValid) throw errorHandler.notFound("Category does not match.");
    
    return isCategoryValid.id;
}

async function getTeacherDiscipline(discipline: string, teacher: string) {
    const teacherId = await verifyExistingTeacher(teacher);
    const disciplineId = await verifyExistingDiscipline(discipline);

    const isTeacherDisciplineValid = await testRepository.findTeacherDiscipline(teacherId, disciplineId);
    if (!isTeacherDisciplineValid) throw errorHandler.notFound("Teacher discipline does not match.");

    return isTeacherDisciplineValid.id;
}

async function verifyExistingDiscipline(discipline: string) {
    const isDisciplineValid = await testRepository.findDiscipline(discipline);
    if (!isDisciplineValid) throw errorHandler.notFound("Discipline does not match.");
    
    return isDisciplineValid.id;
}

async function verifyExistingTeacher(teacher: string) {
    const isTeacherValid = await testRepository.findTeacher(teacher);
    if (!isTeacherValid) throw errorHandler.notFound("Teacher does not match.");
    
    return isTeacherValid.id;
}

async function getTestsByDisciplines() {
    return await testRepository.groupByTestsByDisciplines();
}

async function getTestsByTeachers() {
    return await testRepository.groupByTestsByTeachers();
}

async function getTestsById(id: number) {
    const test =  await testRepository.findTestsById(id);
    if (!test) throw errorHandler.notFound("Test does not found.")

    return test;
}

async function getTestsByDiscipline(discipline: string) {
    return await testRepository.catchTestsByDiscipline(discipline);
}

async function getTestsByTeacher(teacher: string) {
    return await testRepository.catchTestsByTeacher(teacher);
}

const testService = {
    createTest, 
    getTestsByDisciplines, 
    getTestsByTeachers,
    getTestsById,
    getTestsByDiscipline,
    getTestsByTeacher
};

export default testService;