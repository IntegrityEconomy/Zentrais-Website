module.exports = (text) => {
    const lower = text.toLowerCase();

    return {
        category: lower.includes("phone") ? "electronics" : null,
        location: lower.includes("lagos") ? "lagos" : null,
        kerywords: lower.split(" "),
    };
};