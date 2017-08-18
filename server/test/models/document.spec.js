import chai from 'chai';
import db from '../../models';
import helper from '../controllers/mockData';

const expect = chai.expect;

describe('Document Model', () => {
  let userDocument;
  const requiredFields = ['title', 'content'];
  const emptyFields = ['title', 'content', 'access'];

  describe('CREATE Document', () => {
    it('should create a document', (done) => {
      db.Document.create(helper.publicDocument)
        .then((doc) => {
          userDocument = doc.dataValues;
          expect(userDocument.title).to.equal(helper.publicDocument.title);
          expect(userDocument.content)
            .to.equal(helper.publicDocument.content);
          expect(doc.dataValues).to.have.property('createdAt');
          expect(doc.dataValues.userId).to.equal(helper.publicDocument.userId);
          done();
        });
    });
  });

  describe('Not Null Violation', () => {
    requiredFields.forEach((field) => {
      it('should return "not null Violation message"', (done) => {
        const notNull = Object.assign({}, helper.publicDocument);
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
  });

  describe('EMPTY STRING', () => {
    emptyFields.forEach((field) => {
      it('should return error', (done) => {
        const emptyString = Object.assign({}, helper.publicDocument);
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
