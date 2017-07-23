import helper from '../helpers/helper';
import models from '../models';

const User = models.User;
const metaData = helper.paginationMetaData;

function searchUser(req, res) {
  const searchQuery = req.query.q,
    limit = req.query.limit,
    offset = req.query.offset;
  if (!searchQuery) {
    return res.status(400).json({
      message: 'Invalid search input'
    });
  }
  return User
  .findAndCountAll({
    limit,
    offset,
    attributes: { exclude: ['password'] },
    where: {
      userName: {
        $like: `%${searchQuery}%`,
      }
    }
  }).then(({ rows: user, count }) => {
    if (count === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).send({
      user,
      pagination: metaData(count, limit, offset)
    });
  }).catch(error => res.status(400).send(error));
}

export default { searchUser };
