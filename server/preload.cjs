// This file must be loaded with the --require flag in package.json
if (typeof global.File === 'undefined') {
    global.File = class File { };
}

// Also set up Blob if needed
if (typeof global.Blob === 'undefined') {
    global.Blob = class Blob { };
}
