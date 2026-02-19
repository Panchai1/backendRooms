// import { JwtGuard } from './jwt.guard';

// describe('JwtGuard', () => {
//   it('should be defined', () => {
//     expect(new JwtGuard()).toBeDefined();
//   });
// });

import { JwtAuthGuard } from './jwt.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });
});

