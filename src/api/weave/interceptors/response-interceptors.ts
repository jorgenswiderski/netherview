import { RecordCompressor } from '@jorgenswiderski/tomekeeper-shared/dist/models/compressable-record/compressable-record';
import { InternJson } from '@jorgenswiderski/tomekeeper-shared/dist/models/intern-json/intern-json';
import { StaticReference } from '@jorgenswiderski/tomekeeper-shared/dist/models/static-reference/static-reference';
import { AxiosResponse } from 'axios';

export class ResponseInterceptors {
    static Intern = [
        (response: AxiosResponse) => {
            response.data = InternJson.reverseIntern(response.data);

            return response;
        },
        (error: any) => {
            return Promise.reject(error);
        },
    ];

    static RecordCompressor = [
        (response: AxiosResponse) => {
            if (typeof response.data === 'object') {
                response.data = RecordCompressor.parseAllValues(response.data);
            }

            return response;
        },
        (error: any) => {
            return Promise.reject(error);
        },
    ];

    static StaticReference = [
        (response: AxiosResponse) => {
            if (typeof response.data === 'object') {
                response.data = StaticReference.parseAllValues(response.data);
            }

            return response;
        },
        (error: any) => {
            return Promise.reject(error);
        },
    ];
}
