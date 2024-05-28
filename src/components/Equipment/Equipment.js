import React, { useState, useEffect } from 'react';
import './Equipment.css';
import { fetchSvg } from '../../utils/svg';

const equipmentIconMap = {
  bowl: '001-bowl.svg',
  pot: '003-pot.svg',
  pan: '002-pan.svg',
  saucepan: '004-saucepan.svg',
  skillet: '002-pan.svg',
  'frying pan': '005-frying-pan.svg',
  stockpot: '003-pot.svg',
  'dutch oven': '006-pressure-cooker.svg',
  'pressure cooker': '006-pressure-cooker.svg',
  'slow cooker': '008-slow-cooker.svg',
  'baking sheet': '009-tray.svg',
  'cookie sheet': '009-tray.svg',
  'baking dish': '009-tray.svg',
  'roasting pan': '009-tray.svg',
  'cake pan': '011-cake.svg',
  'muffin tin': '011-cake.svg',
  'loaf pan': '012-white-bread.svg',
  'springform pan': '013-cheesecake.svg',
  'pie dish': '014-tart.svg',
  'mixing bowl': '015-bowl-1.svg',
  'salad bowl': '016-salad.svg',
  'measuring cup': '017-measuring-jar.svg',
  'measuring spoon': '018-measuring-spoons.svg',
  colander: '019-colander.svg',
  strainer: '021-strainer.svg',
  sieve: '021-strainer.svg',
  whisk: '022-whisk.svg',
  spatula: '023-spatula.svg',
  tongs: '024-tongs.svg',
  ladle: '025-ladle.svg',
  'slotted spoon': '025-ladle.svg',
  'wooden spoon': '025-ladle.svg',
  grater: '028-grater.svg',
  zester: '029-zester.svg',
  peeler: '030-peeler.svg',
  'garlic press': '031-garlic.svg',
  'can opener': '032-can-opener.svg',
  'bottle opener': '033-bottle-opener.svg',
  corkscrew: '034-corkscrew.svg',
  'cutting board': '035-cutting-board.svg',
  "chef's knife": '036-knife.svg',
  'paring knife': '037-cooking-knife.svg',
  'bread knife': '038-knife-1.svg',
  'carving knife': '039-carving.svg',
  'utility knife': '040-pocket-knife.svg',
  scissors: '041-scissors.svg',
  'kitchen shears': '041-scissors.svg',
  'rolling pin': '042-rolling-pin.svg',
  'pastry brush': '043-pastry-brush.svg',
  'pizza cutter': '044-pizza-cutter.svg',
  'kitchen timer': '045-timer.svg',
  'food processor': '046-blender.svg',
  blender: '046-blender.svg',
  'hand mixer': '047-hand-mixer.svg',
  'stand mixer': '048-mixer.svg',
  microwave: '049-microwave.svg',
  oven: '050-gas-stove.svg',
  stove: '050-gas-stove.svg',
  toaster: '051-toaster.svg',
  'toaster oven': '052-microwave-1.svg',
  'waffle maker': '053-waffle-iron.svg',
  'rice cooker': '054-rice-cooker-1.svg',
  'electric kettle': '055-kettle.svg',
  'coffee maker': '056-coffee-maker.svg',
  'espresso machine': '057-espresso.svg',
  'tea infuser': '058-tea.svg',
  grill: '059-grill.svg',
  griddle: '060-griddle.svg',
  broiler: '061-boiled.svg',
  thermometer: '062-thermometer.svg',
  scale: '063-scale.svg',
  mandoline: '064-carrot.svg',
  'food mill': '065-coffee-grinder.svg',
  'mortar and pestle': '066-mortar.svg',
  ricer: '067-masher.svg',
  'salad spinner': '068-steamer.svg',
  'steamer basket': '068-steamer.svg',
  'sous vide machine': '072-sous-vide-machine.svg',
  dehydrator: '070-food-dehydrator.svg',
  'ice cream maker': '071-ice-cream-machine.svg',
  'popcorn maker': '073-vending-machine.svg',
  'egg slicer': '074-slicer.svg',
  'egg timer': '075-kitchen-timer.svg',
};

const capitalizeItem = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const Equipment = ({
  equipment,
  isEditing,
  onInputChange,
  onRemove,
  colorClass,
}) => {
  const [svgContentMap, setSvgContentMap] = useState({});

  useEffect(() => {
    const loadSvgContent = async () => {
      const newSvgContentMap = {};
      for (const item of equipment) {
        if (!newSvgContentMap[item]) {
          const svgPath = `/equipment-icons/${equipmentIconMap[item]}`;
          const svgContent = await fetchSvg(svgPath);
          newSvgContentMap[item] = svgContent;
        }
      }
      setSvgContentMap(newSvgContentMap);
    };

    loadSvgContent();
  }, [equipment]);

  return (
    <ul className="list-disc list-inside grid grid-cols-2 gap-4">
      {equipment.map((item, index) => (
        <li key={index} className="flex items-center">
          {isEditing ? (
            <>
              <input
                type="text"
                value={item}
                onChange={(e) => onInputChange(e, index)}
                className="form-input w-full"
              />
              <button
                onClick={() => onRemove(index)}
                className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                <i className="fas fa-times"></i>
              </button>
            </>
          ) : (
            <>
              <div
                className={`w-10 h-10 mr-2 ${colorClass}`}
                style={{ width: '2.5rem', height: '2.5rem' }}
                dangerouslySetInnerHTML={{
                  __html: svgContentMap[item],
                }}
              />
              <span className={colorClass}>{capitalizeItem(item)}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Equipment;
