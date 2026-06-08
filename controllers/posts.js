import { posts, validatePostAndPut, filterPosts, createPostSlug, getCreationTime, validatePatch } from "../data/posts.js";
import connection from "../data/db.js";
import { fetchAllPosts, fetchPostByID } from "../utils/dbFunctions.js";

const postsController = {
    index,
    show,
    store,
    update,
    modify,
    destroy
}

async function index(request, response) {
    const results = await fetchAllPosts();

    if(results.length === 0){
        return response.status(404).json({
            error: "Non sono stati trovati post",
            result: null
        });
    }
    const output = results.map(result => {
        const {id, ...remaining} = result;
        return remaining;
    })
    response.json(
        {
            error: null,
            result: output
        }
    )

}

async function show(request, response) {
    const foundPost = await fetchPostByID(request.id);
    if(foundPost.length === 0){
        return response.status(404).json({
            error: "Nessun post trovato a quell'id",
            result: null
        });
    }

    const {id, ...remaining} = foundPost[0];

    response.json({
        error: null,
        result: [remaining] // messo l'array per mantenere coerenza con la index che restituisce un array
    })

}

function store(request, response) {

    const validatedPost = request.validatedPost;
    const newPost = ({
        ...validatedPost,
        id: posts.length + 1,
        created_at: getCreationTime()
    });

    newPost.slug = createPostSlug(newPost);

    posts.push(newPost);

    response.status(201).json({
        error: null,
        result: newPost
    })
}

function update(request, response) {
    const updateReceived = request.validatedPost; // E' una put, quindi mi aspetto di ricevere TUTTI i dati, per modificare quello che già ho con i dati nuovi.
    const foundPostIndex = request.foundPostIndex;
    
    const newPost = ({
        ...posts[foundPostIndex],
        ...updateReceived,
        created_at: getCreationTime()
    })

    newPost.slug = createPostSlug(newPost);

    posts.splice(foundPostIndex, 1 , newPost);

    const {id, created_at, ...remaining} = newPost;

    response.json({
        error:null,
        result: remaining
    })
}

function modify(request, response) {
    const modifications = request.validatedModifications;
    const foundPostIndex = request.foundPostIndex;
    
    const newPost = ({
        ...posts[foundPostIndex],
        ...modifications,
        created_at: getCreationTime()
    })

    newPost.slug = createPostSlug(newPost);

    posts.splice(foundPostIndex, 1, newPost);

    const {id, created_at, ...remaining} = newPost;

    response.json({
        error:null,
        result: remaining
    })
}

function destroy(request, response) {
    const foundPostIndex = request.foundPostIndex
    posts.splice(foundPostIndex, 1);
    response.sendStatus(204);
}

export default postsController;
