import connection from "../data/db.js";

async function linkPostWithTags(postId, tagId){
    const queryLink = `
    INSERT INTO post_tag(post_id, tag_id)
    VALUES (?, ?)
    `;

    const results = await connection.execute(queryLink, [postId, tagId]);
    return results[0];
}

async function createNewPost(post){
    const {title, content, image} = post;
    const queryCreatePost = `
    INSERT INTO posts(title, content, image)
    VALUES (?, ?, ?)
    `;
    const results = await connection.execute(queryCreatePost, [title, content, image]);
    return results[0].insertId;
}

async function createNewTag(tag){
    
    const queryCreateTag = `
    INSERT INTO tags (label)
    VALUES (?)
    `;

    const results = await connection.execute(queryCreateTag, [tag]);
    return results[0].insertId;
}

async function fetchAllTags(){
    const querySelect = `
    SELECT t.label, t.id
    FROM tags t
    WHERE 1;
    `

    const results = await connection.query(querySelect);
    return results[0].map(tag => {return {label:tag.label, id:tag.id}});
}

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
    `;
    const results = await connection.query(querySelect);
    const tags = [];

    for(let i=0 ; i < results[0].length; i++){
        const currentTags = await connection.execute(querySelectTags, [results[0][i].id]);
        results[0][i].tags = (currentTags[0].map(tag => tag.label));
    }

    return results[0];
}

async function fetchPostByID(id) {
    const querySelect = `
    SELECT p.title, p.content, p.image, p.id
    FROM posts p
    WHERE p.id = ?;
    `;
    
    const querySelectTags = `
    SELECT t.label 
    FROM tags t
    JOIN post_tag pt
    ON t.id = pt.tag_id
    WHERE pt.post_id = ?;
    `
    const results = await connection.execute(querySelect, [id]);
    const tags = [];

    for(let i=0 ; i < results[0].length; i++){
        const currentTags = await connection.execute(querySelectTags, [results[0][i].id]);
        results[0][i].tags = (currentTags[0].map(tag => tag.label));
    }

    return results[0];
    
}

async function deletePostByID(id){
    const queryDelete = `
    DELETE FROM posts as p
    WHERE p.id = ?;
    `
    const results = await connection.execute(queryDelete, [id]);
}

export {
    fetchAllPosts,
    fetchPostByID,
    deletePostByID,
    fetchAllTags,
    createNewTag,
    createNewPost,
    linkPostWithTags};