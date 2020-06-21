const Member = require('../Model/Member');
const Statistics = require('../Model/Statistics');

class MemberManager {
    static async memberJoinEvent(member) {
        if (!member)
            return;

        const foundMember = await Member.findOne({ memberId: member.id });

        if (!foundMember) {
            const newMember = new Member();
            newMember.memberId = member.id;
            newMember.name = !member.nickname ? member.user.username : member.nickname;
            newMember.joinTimestamp = Date.now().toString();
            await newMember.save();
            return;
        }

        if (!foundMember.joinTimestamp)
            foundMember.joinTimestamp = Date.now().toString();

        foundMember.numberOfReenties++;
        await foundMember.save();
    }

    static async memberNicknameUpdateEvent(memberId, oldNickname, newNickname) {
        const foundMember = await Member.findOne({ memberId });

        if (!foundMember) {
            const newMember = new Member();
            newMember.memberId = memberId;
            newMember.name = newNickname;
            newMember.namesHistory = new Array();
            newMember.joinTimestamp = 0;
            await newMember.save();
            return;
        }

        foundMember.namesHistory.push({
            newName: newNickname,
            oldName: oldNickname,
            changeTimestamp: Date.now().toString()
        });

        foundMember.name = newNickname;
        await foundMember.save();
    }
}

module.exports = MemberManager;