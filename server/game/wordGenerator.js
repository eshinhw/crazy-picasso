const { generateSlug } = require("random-word-slugs");

const getXWords = (numberOfWords) => {
    const options = {
        format: 'lower', 
        categories: {noun: []}
    };

    const slugs = generateSlug(numberOfWords, options);
    const slugsArray = slugs.split(" ");

    return slugsArray;
}


module.exports = {
    getXWords
}