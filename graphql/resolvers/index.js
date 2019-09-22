const bcrypt = require('bcryptjs');


const Event = require('../../models/event');
const User = require('../../models/user');

const events =  async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
    } catch (error) {
        throw error;
    }
}


const user =  async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                }
            })
        } catch (error) {
            throw error;
        }

    },
    createEvents: async args => {
        try {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5d871165d16588a0dd738304'
        });
        let createdEvent;
        const result = await event.save()
                createdEvent = {
                    ...result._doc,
                    _id: result._doc._id.toString(),
                    date: new Date(result._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator)}
                const creator = await User.findById('5d871165d16588a0dd738304')
                if (!creator) {
                    throw new Error('User not found!')
                }
                creator.createdEvents.push(event)
                await creator.save()
                return createdEvent;
        } catch(error) {
            throw error;
        }
    },
    createUsers: async args => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error('User exists already!');
            }
            const hashPassword = await bcrypt.hash(args.userInput.password,12)
            const user = new User({
                email: args.userInput.email,
                password: hashPassword
            });
            const result = await user.save()
            return { ...result._doc,password: null, _id: result.id}
        } catch (error) {
            throw error
        }
    }
}