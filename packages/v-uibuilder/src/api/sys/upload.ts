import { UploadApiResult } from './model/uploadModel'; 
import { useGlobSetting } from '@/hooks/setting';
import { UploadFileParams } from '@/types/axios';
import { defHttp } from '@/utils/http/axios';

const { uploadUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress,
    },
    params
  );
}
