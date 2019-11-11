const ArrayFun = {
    reMoveByItem(arr,item){
        let i = arr.length;
        let ite = '' + item;
        while (i--) {
            if (arr[i] == ite) {
                return i;
            }
        }
        return false;
    },
    isBol(arr,item){
        let i = arr.length;
        let ite = '' + item;
        while (i--) {
            if (arr[i] == ite) {
                return true;
            }
        }
        return false;
    },
    arryByMongoId(arr,id){
        let i = arr.length;
        while (i--){
            if (arr[i]._id == id) {
                return i;
            }

        }
        return false
    },
    arryByMongoId2(arr,id){
        let i = arr.length;
        while (i--){
            if (arr[i]._id == id) {
                return i;
            }

        }
        return -1
    },
    isBolarryByMongoId(arr,id){
        let i = arr.length;
        while (i--){
            if (arr[i]._id == id) {
                return true;
            }

        }
        return false
    },
    isBolarryByArticleId(arr,id){
        let i = arr.length;
        while (i--){
            if (arr[i].article._id == id) {
                return true;
            }

        }
        return false
    },
    arryByArticleId(arr,id){
        let i = arr.length;
        while (i--){
            if (arr[i].article._id == id) {
                return i;
            }

        }
        return false
    },
}

module.exports = ArrayFun;