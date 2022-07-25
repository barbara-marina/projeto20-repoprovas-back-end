import prisma from "../config/database.js";


async function findCategories() {
    return await prisma.category.findMany({});
}
const categoryRepository = {
    findCategories
};

export default categoryRepository;