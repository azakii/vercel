import contentFullConnect from '../contentful'

const getExpContentfull = async (cmsId) => {
    let env = await contentFullConnect();
    console.log(cmsId)
    let entry = await env.withAllLocales.getEntry(cmsId);
    console.log(entry)

    return entry;
}

export default getExpContentfull;