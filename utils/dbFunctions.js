import connection from "../data/db.js";

async function fetchAllPosts() {
    const querySelect = `
        SELECT p.title, p.content, p.image, p.id
        FROM posts p
        WHERE 1 ;   
    `;

    const querySelectTags = `
    SELECT t.label 
    FROM tags t
    JOIN post_tag pt
    ON t.id = pt.tag_id
    WHERE pt.post_id = ?;
    `
    const results = await connection.query(querySelect);
    const tags = [];

    for(let i=0 ; i < results[0].length; i++){
        const currentTags = await connection.execute(querySelectTags, [results[0][i].id]);
        results[0][i].tags = (currentTags[0].map(tag => tag.label));
    }

    return results[0];
}

export {fetchAllPosts};