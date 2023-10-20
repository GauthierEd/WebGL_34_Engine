export class LightManager{
    constructor(){
        this.lights = [];
    }

    add(light){
        this.lights.push(light);
    }

    getArray(type) {
        return this.lights.reduce((result, light) => {
          result = result.concat(light[type]);
          return result;
        }, []);
    }
    
    get(index) {
        if (typeof index === 'string') {
            return this.list.find(light => light.name === index);
        } else {
            return this.list[index];
        }
    }
}