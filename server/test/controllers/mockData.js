import dotenv from 'dotenv';

dotenv.config();

export default {
  admin: {
    email: 'baas@test.com',
    password: process.env.TEST_ADMIN_PASSWORD
  },
  fellow: {
    email: 'john@test.com',
    password: process.env.TEST_FELLOW_PASSWORD
  },
  superadmin: {
    email: 'iakhator@test.com',
    password: process.env.TEST_FACILITATOR_PASSWORD
  },
  wrongPassword: {
    email: 'baas@test.com',
    password: 'test'
  },
  iakhator: {
    email: 'iakhator@test.com',
    password: process.env.PASSWORD
  },
  incorrectCredentials: {
    email: 'test@test123.com',
    password: 'test'
  },
  fakeBass: {
    fullName: 'Baasbank Adams',
    userName: 'tiaandela',
    email: 'name@example.com',
    password: process.env.PASSWORD,
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  Baas: {
    fullName: 'Baas Bank',
    userName: 'bank',
    email: 'baas@test.com',
    password: process.env.PASSWORD,
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  regularUser: {
    fullName: 'Elo Elo',
    userName: 'elome',
    email: 'elo@email.com',
    roleId: 2,
    password: process.env.PASSWORD,
  },
  invalidEmailUser: {
    userName: 'johnson',
    fullName: 'Johnson James',
    email: 'kkkkk',
    roleId: 2,
    password: process.env.PASSWORD
  },
  firstUser: {
    userName: 'ola',
    fullName: 'Ola dey',
    email: 'ola@test.com',
    roleId: 2,
    password: process.env.PASSWORD
  },
  JohnB: {
    fullName: 'John Bosco',
    userName: 'john',
    email: 'john@test.com',
    password: process.env.PASSWORD,
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  fakeUserDetails: {
    fullName: 'Daniel Cfh',
    userName: 'cfh',
    email: 'cfh@example.com',
    password: process.env.PASSWORD,
    roleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  naddDocument: {
    title: 'John naddddd',
    content: 'John watches american gods regularly',
    access: 'private',
    userId: 2
  },
  johnDoeDocument: {
    title: 'John Doe',
    content: 'eze goes to school',
    access: 'public',
    userId: 2
  },
  hannDocument: {
    title: 'James Hannn',
    content: 'Han is a bad guy',
    access: 'role',
    userId: 2,
  },
  andelaDocument: {
    title: 'hey yo!',
    content: 'Andela is really fun!!',
    access: 'public',
    userId: 2
  },
  boromirOneDocument: {
    title: 'boromir-team',
    content: 'Andela is really awesome !!!',
    access: 'private',
    userId: 6
  },
  boromirAccess: {
    title: 'boromir-team',
    content: 'Andela is really awesome!!!',
    access: '',
    userId: 1,
  },
  boromirTitle: {
    title: '',
    content: 'Andela is really awesome!!!',
    access: 'public',
    userId: 2
  },
  boromirContent: {
    title: 'boromir-team',
    content: '',
    value: 'public',
    userId: 2,
  },
  publicDocument: {
    title: 'Femi a regular',
    content: 'Femi is a regular guy',
    access: 'public',
    userId: 2
  },
};
