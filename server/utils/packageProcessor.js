const { get } = require("http");

//this is rate of courier given in dollars for different weight in grams
const courierRates=[
  {
    maxWeight: 200,
     charge: 5
  },

  {
    maxWeight: 500,
    charge: 10
  },

  {
    maxWeight: 1000,
    charge: 15
  },

  {
    maxWeight: 5000,
    charge: 20
  }
];

//this function takes weight in grams and returns the rate of courier
const getCourierRate = (weight) => {
  for (let rate of courierRates){
    if(weight <= rate.maxWeight){
      return rate.charge;
    }
  }
  return 0;
};

//group items into packages under $250

const groupItemsByPriceLimit = (items, priceLimit =250) => {
  //high t low price
  const sorted =[...items].sort((a,b) => b.price - a.price);
  const packages = [];

  for (let item of sorted){
    let placed = false;

    for (let pkg of packages){
      if(pkg.totalPrice + item.price <=priceLimit){
        pkg.items.push(item);
        pkg.totalPrice += item.price;
        pkg.totalWeight += item.weight;
        placed = true;
        break;
      }
    }

    if(!placed){
      packages.push({
        items: [item],
        totalPrice: item.price,
        totalWeight: item.weight
      });
    }
  }
  return packages;
}

//balance pkg weights across existing packages

const balanceWeights = (packages) => {
  //sort packages by weight in descending order
  packages.sort((a,b) => a.totalWeight - b.totalWeight);

  // Basic weight balancing loop: move lighter items to lighter packages
  let moved;
  do {
    moved = false;
    for (let i = 0; i < packages.length - 1; i++) {
      for(let j = i+1; j< packages.length; j++){
        if(packages[i].totalWeight > packages[j].totalWeight){
          const heavy = packages[i];
          const light = packages[j];

          // find item in heavy that can be moved to light without exceeding price limit
          const candidate = heavy.items.find(item =>
            light.totalPrice + item.price <= 250 && heavy.totalWeight - item.weight > light.totalWeight+ item.weight
          );

          if (candidate){
            //move item

            heavy.items = heavy.items.filter(item => item !== candidate);

            heavy.totalPrice -= candidate.price;
            heavy.totalWeight -= candidate.weight;

            light.items.push(candidate);
            light.totalPrice += candidate.price;
            light.totalWeight += candidate.weight;
            moved = true;
        }
      }
    }
  }
} while (moved);
  return packages;
};

//MAIN FUNCTION
const packageProcessor = (items) => {
  if (!Array.isArray(items)) return[];

  //group price into price-valid packages
  let packages = groupItemsByPriceLimit(items);

  //rebalance weights to make it even

  packages= balanceWeights(packages);

  //calculate courier rates

   packages.forEach(pkg => {
    pkg.courierPrice = getCourierRate(pkg.totalWeight);
  });
  return packages;
};

module.exports = packageProcessor;