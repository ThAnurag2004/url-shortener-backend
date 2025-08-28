import express from "express";
import {shortenPostRequestBodySchema} from '../validation/request.validation.js';
import {nanoid} from 'nanoid';
import {insertUrl} from '../services/url.service.js'
import {ensureAuthenticated} from '../middlewares/auth.middleware.js'
const router = express.Router();
import {urlsTable} from '../model/index.js'
import { db } from '../db/index.js'
import { eq,and } from "drizzle-orm";

router.post('/shorten',ensureAuthenticated, async(req,res)=>{
    const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
        return res.status(400).json({error : validationResult.error.format()});
    }

    const {url, code} = validationResult.data;

    const shortCode = code ?? nanoid(6);
    const userId = req.user.id;
    const result = await insertUrl(shortCode,url,userId);

    return res.status(201).json({id: result.id, shortCode: result.shortCode, targetURL: result.targetURL});
})


router.get('/codes', ensureAuthenticated, async function(req,res){
    const codes = await db.select().from(urlsTable).where(eq(urlsTable.userId, req.user.id))

    return res.json({codes})
})

router.delete('/:id', ensureAuthenticated, async function(req, res){
    await db.delete(urlsTable).where(and(eq(urlsTable.id, req.params.id)),eq(urlsTable.userId, req.user.id));

    return res.status(200).json({deleted : true})
})

router.get('/:shortcode', async function(req,res){
    const code = req.params.shortcode;

    const [result] = await db.select({targetURL: urlsTable.targetURL}).from(urlsTable).where(eq(urlsTable.shortCode, code))

    if(!result){
        return res.status(404).json({error : 'Invalid Short Code'})
    }

    return res.redirect(result.targetURL);
})



export default router;