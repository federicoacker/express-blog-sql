
function checkId(request, response, next){
    const id = request.params.id;
    const idReal = parseInt(id);
    if(isNaN(idReal)){
        return response.status(404).json({
            error: "L'id ha un formato sbagliato",
            result: null
        });
    }

    request.id = idReal;
    next();
}

export default checkId;