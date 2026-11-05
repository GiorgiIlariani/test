import { PERMISSIONS } from '../config/permissions';
import axios from 'axios';

type Permissions = (typeof PERMISSIONS)[number];

const validatePermissions = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:8000'}/api/permissions`,
  );
  const backPermissions = response.data.permissions;
  let userPermissions: Permissions[] = [];

  for (let i = 0; i < backPermissions.length; i++) {
    if (!PERMISSIONS.includes(backPermissions[i])) {
      userPermissions.push(backPermissions[i]);
    }
  }
  console.info(userPermissions);
};

validatePermissions();
