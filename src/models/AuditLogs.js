import mongoose from "mongoose";

const auditLogsSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true,
        trim: true
    },
    metodo: {
        type: String,
        required: true,
        trim: true
    },
    status_code: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const AuditLog = mongoose.model(
    "AuditLog",
    auditLogsSchema
);

export default AuditLog;