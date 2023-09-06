const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const {BlogServiceClient} = require('../proto/blog_grpc_pb');
const {Blog, BlogId} = require('../proto/blog_pb');

function createBlog(client) {
    console.log('---createBlog was invoked---');

    return new Promise((resolve, reject) => {
        const req = new Blog()
          .setAuthorId('Clement')
          .setTitle('My First Blog')
          .setContent('Content of the first blog');

        client.createBlog(req, (err, res) => {
            if (err) {
                reject(err);
            }

            console.log(`Blog was created: ${res}`);
            resolve(res.getId());
        });
    });
}

function readBlog(client, id) {
    console.log('---readBlog was invoked---');

    return new Promise((resolve, reject) => {
        const req = new BlogId().setId(id);

        client.readBlog(req, (err, res) => {
            if (err) {
                reject(err);
            }

            console.log(`Blog was read: ${res}`);
            resolve();
        });
    });
}

async function main() {
    const tls = true;
    let creds;

    if (tls) {
        const rootCert = fs.readFileSync('../ssl/ca.cert');

        creds = grpc.ChannelCredentials.createSsl(rootCert);
    } else {
        creds = grpc.ChannelCredentials.createInsecure();
    }
    const client = new BlogServiceClient('localhost:50051', creds);

    const id = await createBlog(client);
    await readBlog(client, id);
    // await readBlog(client, 'aNonExistingId');

    client.close();
}

main();