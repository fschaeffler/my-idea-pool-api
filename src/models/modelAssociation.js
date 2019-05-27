import { AccessToken } from './accessToken';
import { Idea } from './idea';
import { User } from './user';

export default () => {
    AccessToken.belongsTo(User, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    User.hasMany(AccessToken, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    Idea.belongsTo(User, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    User.hasMany(Idea, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });
};
