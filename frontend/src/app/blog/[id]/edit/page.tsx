
function EditPage({params}: {params: {id: number}}) {
    
    const id = params.id
    
    return <div>
        Edit blog post with id = {id}
    </div>
    
}

export default EditPage;