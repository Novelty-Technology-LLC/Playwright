import 'dotenv/config';
import path from 'node:path';
import Client from 'ssh2-sftp-client';

function sftpConfig(): Client.ConnectOptions {
  const host = process.env.SFTP_HOST;
  const username = process.env.SFTP_USERNAME;
  const password = process.env.SFTP_PASSWORD;

  if (
    !host ||
    !username ||
    !password ||
    host.includes('your-sftp-server') ||
    username.includes('your-sftp-username')
  ) {
    throw new Error(
      'Update .env with real SFTP_HOST, SFTP_USERNAME, and SFTP_PASSWORD (placeholders will time out).'
    );
  }

  return {
    host,
    port: Number(process.env.SFTP_PORT || 22),
    username,
    password,
    readyTimeout: 20000,
  };
}

export async function uploadFixture(
  fileName: string,
  remotePath: string
): Promise<'uploaded'> {
  const localPath = path.resolve('fixtures', fileName);
  const sftp = new Client();

  try {
    await sftp.connect(sftpConfig());
    await sftp.put(localPath, remotePath);
    await sftp.end();
    return 'uploaded';
  } catch (err) {
    console.error('SFTP Upload Error:', err);
    throw err;
  }
}
