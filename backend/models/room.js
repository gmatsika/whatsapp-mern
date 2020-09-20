import mongoose from 'mongoose';

const roomShema = mongoose.Schema({
    name: String
})

export default mongoose.model('rooms', roomShema);