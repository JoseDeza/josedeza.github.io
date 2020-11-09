    return new Promise(
        function (resolve, reject) {



            if (configArray) {
                resolve(configArray);
            } else {
                reject(new Error("error message"));
            }

        });
