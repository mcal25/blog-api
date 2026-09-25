import { prisma } from "../lib/prisma.js";

export async function getUserById(userId) {
    const id = Number(userId);

    if (!Number.isInteger(id)) {
        return null;
    }

    return prisma.user.findUnique({
        where: { id },
    });
}