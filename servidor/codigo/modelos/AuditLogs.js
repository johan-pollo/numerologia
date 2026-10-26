import mongoose from "mongoose";

const auditLogsSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2048
    },
    metodo: {
        type: String,
        required: true,
        trim: true,
        enum: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    },
    status_code: {
        type: Number,
        required: true,
        min: 100,
        max: 599,
        validate: Number.isInteger
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const AuditLog = mongoose.model(
    "AuditLog",
    auditLogsSchema
);

export default AuditLog;