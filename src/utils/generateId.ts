import uuid from 'uuid-random';

class IdGenerator {
  generate(): string {
    return uuid()
  }
}

export default IdGenerator;

