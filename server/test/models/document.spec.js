import chai from 'chai';
import db from '../../models';
import mockData from '../controllers/mockData';

const expect = chai.expect;

describe('Document Model', () => {
  let userDocument;
  const requiredFields = ['title', 'content'];
  const emptyFields = ['title', 'content', 'access'];

  describe('CREATE', () => {
    it('should add a new document', (done) => {
      db.Document.create(mockData.publicDocument)
        .then((doc) => {
          userDocument = doc.dataValues;
          expect(userDocument.title).to.equal(mockData.publicDocument.title);
          expect(userDocument.content)
            .to.equal(mockData.publicDocument.content);
          expect(doc.dataValues).to.have.property('createdAt');
          expect(doc.dataValues.userId)
          .to.equal(mockData.publicDocument.userId);
          done();
        });
    });

    requiredFields.forEach((field) => {
      it(`should return "not null Violation message"
      when a user want to create a document without
      providing a field value`, (done) => {
        const notNull = Object.assign({}, mockData.publicDocument);
        notNull[field] = null;
        db.Document.create(notNull)
          .then()
          .catch((error) => {
            expect(error.errors[0].type).to.equal('notNull Violation');
            expect(error.errors[0].path).to.equal(field);
            expect(error.errors[0].value).to.equal(null);
            done();
          });
      });
    });

    emptyFields.forEach((field) => {
      it(`should return an error
        message if the user enters an empty string`, (done) => {
        const emptyString = Object.assign({}, mockData.publicDocument);
        emptyString[field] = ' ';
        db.Document.create(emptyString)
          .then()
          .catch((error) => {
            expect(error.errors[0].message)
              .to.equal('This field cannot be empty');
            expect(error.errors[0].type).to.equal('Validation error');
            expect(error.errors[0].path).to.equal(field);
            done();
          });
      });
    });
  });
});
