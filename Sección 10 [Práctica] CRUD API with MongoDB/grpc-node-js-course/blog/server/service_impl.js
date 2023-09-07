const grpc = require('@grpc/grpc-js');
const {Blog, BlogId} = require('../proto/blog_pb');
const {ObjectId} = require('mongodb');
const { Empty } = require('google-protobuf/google/protobuf/empty_pb');

function blogToDocument(blog) {
    return {
        author_id: blog.getAuthorId(),
        title: blog.getTitle(),
        content: blog.getContent(),
    }
}

const internal = (err, callback) => callback({
    code: grpc.status.INTERNAL,
    message: err.toString(),
});

function checkNotAcknowledged(res, callback) {
    if (!res.acknowledged) {
        callback({
            code: grpc.status.INTERNAL,
            message: `Operation wasn\'t acknowledged`,
        });
    }
}

function checkOID(id, callback) {
    try {
        return new ObjectId(id);
    } catch (err) {
        callback({
            code: grpc.status.INTERNAL,
            message: 'Invalid OID'
        });
    }
}

function checkNotFound(res, callback) {
    if (!res || res.matchedCount == 0) {
        callback({
            code: grpc.status.NOT_FOUND,
            message: 'Could not find blog',
        })
    }
}

function documentToBlog(doc) {
    return new Blog()
      .setId(doc._id.toString())
      .setAuthorId(doc.author_id)
      .setTitle(doc.title)
      .setContent(doc.content);
}

exports.createBlog = async (call, callback) => {
    const data = blogToDocument(call, request);

    await collection.insertOne(data).then((res) => {
        checkNotAcknowledged(res, callback);
        const id = res.insertedId.toString();
        const blogId = new BlogId().setId(id);

        callback(null, blogId);
    }).catch((err) => internal(err, callback));
}

exports.readBlog = async (call, callback) => {
    const oid = checkOID(call.request.getId(), callback);

    await collection.findOne({_id: oid}).then((res) => {
        checkNotFound(res, callback);
        callback(null, documentToBlog(res));
    }).catch((err) => internal(err, callback));
}

exports.updateBlog = async (call, callback) => {
    const oid = checkOID(call.request.getId(), callback);

    await callection.updateOne(
        {_id: oid},
        {$set: blogToDocument(call.request)},
        ).then((res) => {
            checkNotFound(res, callback);
            checkNotAcknowledged(res, callback);
            callback(null, new Empty());
        }).catch((err) => internal(err, callback));
}