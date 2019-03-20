    import ApiBase from './ApiBase'

    export default class orderCommon extends ApiBase {

      //接受订单API;
      async ensureAcceptOrder(item) {

        const url = '/custom/manufacturer/order/accept'

        let data = {
          'id': Number(item.id)
        }

        const response = await super.request(url, data);

        return response.data;
      }

      //修改价格API;
      async submitNewPrice(item) {

        const url = '/custom/manufacturer/order/changeAmount';

        let data = item;

        const response = await super.request(url, data)

        return response.data;
      }

      //拒绝接单API;
      async refuseOrderApi(item) {

        const url = '/custom/manufacturer/order/reject';

        let data = item;

        const response = await super.request(url, data)

        return response.data;
      }

      //

    }
