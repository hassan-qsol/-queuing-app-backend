import * as crypto from 'crypto';

class PasswordHash {
  private itoa64: string =
    './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private iteration_count_log2: number = 8;
  private portable_hashes: boolean = true;
  private random_state: string = Date.now().toString();

  // constructor(iteration_count_log2: number, portable_hashes: boolean) {
  //   this.itoa64 =
  //     './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  //   if (iteration_count_log2 < 4 || iteration_count_log2 > 31) {
  //     iteration_count_log2 = 8;
  //   }
  //   this.iteration_count_log2 = iteration_count_log2;
  //   this.portable_hashes = portable_hashes;
  //   this.random_state = Date.now().toString();
  // }

  private get_random_bytes(count: number): Buffer {
    let output: Buffer;

    try {
      output = crypto.randomBytes(count);
    } catch (ex) {
      output = Buffer.alloc(count);
      for (let i = 0; i < count; i += 16) {
        this.random_state = crypto
          .createHash('md5')
          .update(this.random_state)
          .digest('binary');
        output.write(
          crypto.createHash('md5').update(this.random_state).digest('binary'),
          i,
        );
      }
    }

    return output;
  }

  private encode64(input: Buffer, count: number): string {
    let output = '';
    let i = 0;
    do {
      let value = input.readUInt8(i++);
      output += this.itoa64[value & 0x3f];
      if (i < count) {
        value |= input.readUInt8(i) << 8;
      }
      output += this.itoa64[(value >> 6) & 0x3f];
      if (i++ >= count) {
        break;
      }
      if (i < count) {
        value |= input.readUInt8(i) << 16;
      }
      output += this.itoa64[(value >> 12) & 0x3f];
      if (i++ >= count) {
        break;
      }
      output += this.itoa64[(value >> 18) & 0x3f];
    } while (i < count);

    return output;
  }

  private gensalt_private(input: Buffer): string {
    let output = '$P$';
    output += this.itoa64[Math.min(this.iteration_count_log2 + 5, 30)];
    output += this.encode64(input, 6);

    return output;
  }

  private crypt_private(password: string, setting: string): string {
    let output = '*0';
    if (setting.substr(0, 2) === output) {
      output = '*1';
    }

    const id = setting.substr(0, 3);
    if (id !== '$P$' && id !== '$H$') {
      return output;
    }

    const count_log2 = this.itoa64.indexOf(setting[3]);
    if (count_log2 < 7 || count_log2 > 30) {
      return output;
    }

    let count = 1 << count_log2;

    const salt = setting.substr(4, 8);
    if (salt.length !== 8) {
      return output;
    }

    let hash = crypto
      .createHash('md5')
      .update(salt + password)
      .digest();
    do {
      hash = crypto
        .createHash('md5')
        .update(Buffer.concat([hash, Buffer.from(password)]))
        .digest();
    } while (--count);

    output = setting.substr(0, 12) + this.encode64(hash, 16);

    return output;
  }

  private gensalt_blowfish(input: Buffer): string {
    const itoa64 =
      './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let output = '$2a$';
    output += String.fromCharCode(
      '0'.charCodeAt(0) + this.iteration_count_log2 / 10,
    );
    output += String.fromCharCode(
      '0'.charCodeAt(0) + (this.iteration_count_log2 % 10),
    );
    output += '$';

    let i = 0;
    do {
      let c1 = input.readUInt8(i++);
      output += itoa64[c1 >> 2];
      c1 = (c1 & 0x03) << 4;
      if (i >= 16) {
        output += itoa64[c1];
        break;
      }

      let c2 = input.readUInt8(i++);
      c1 |= c2 >> 4;
      output += itoa64[c1];
      c1 = (c2 & 0x0f) << 2;

      c2 = input.readUInt8(i++);
      c1 |= c2 >> 6;
      output += itoa64[c1];
      output += itoa64[c2 & 0x3f];
    } while (true);

    return output;
  }

  HashPassword(password: string): string {
    let random = '';
    // CRYPT_BLOWFISH === 1 &&
    if (!this.portable_hashes) {
      random = this.get_random_bytes(16).toString();
      const hash = crypto.createHash('md5').update(random).digest();
      return this.crypt_private(password, this.gensalt_blowfish(hash));
    }

    if (random.length < 6) {
      random = this.get_random_bytes(6).toString();
    }
    const hash = this.crypt_private(
      password,
      this.gensalt_private(Buffer.from(random)),
    );
    return hash.length === 34 ? hash : '*';
  }

  CheckPassword(password: string, stored_hash: string): boolean {
    let hash = this.crypt_private(password, stored_hash);
    if (hash[0] === '*') {
      hash = this.crypt_private(password, stored_hash);
    }

    // This is not constant-time.
    // For timing safety, rely on the salts being unpredictable.
    return hash === stored_hash;
  }
}

export default PasswordHash;
