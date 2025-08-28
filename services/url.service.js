import {urlsTable} from '../model/index.js'
import { db } from '../db/index.js'

export async function insertUrl(shortCode,url,userId){
    const [result] = await db.insert(urlsTable).values({
        shortCode,
        targetURL: url,
        userId
    }).returning({id: urlsTable.id, shortCode: urlsTable.shortCode, targetURL: urlsTable.targetURL});
    return result;
}