import React from 'react';

const NutritionalInfo = ({ nutrients }) => {
  const dailyValues = {
    carbohydrateContent: 275,
    cholesterolContent: 300,
    fatContent: 78,
    fiberContent: 28,
    proteinContent: 50,
    saturatedFatContent: 20,
    sodiumContent: 2300,
    sugarContent: 50
  };

  const calculateDailyValue = (value, total) => {
    return ((parseInt(value, 10) / total) * 100).toFixed(1) + '%';
  };

  return (
    <section className="border border-black p-4 max-w-xl mx-auto">
      <header className="border-b-4 border-black pb-2 mb-2">
        <h1 className="font-bold text-2xl mb-1">Nutrition Facts</h1>
      </header>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th colSpan="3" className="text-left border-t border-black pt-2">Amount Per Serving</th>
          </tr>
        </thead>
        <tbody>
          {nutrients?.calories && (
            <tr className="border-t border-black">
              <th colSpan="2" className="font-bold">Calories {nutrients.calories}</th>
              <td className="text-right">Calories from Fat {Math.round((parseInt(nutrients.fatContent) * 9))}</td>
            </tr>
          )}
          <tr className="border-t-4 border-black">
            <td colSpan="3" className="text-left font-bold">% Daily Value*</td>
          </tr>
          {nutrients?.fatContent && (
            <tr className="border-t border-black">
              <th colSpan="2" className="font-bold">Total Fat {nutrients.fatContent}</th>
              <td className="text-right font-bold">{calculateDailyValue(nutrients.fatContent, dailyValues.fatContent)}</td>
            </tr>
          )}
          {nutrients?.saturatedFatContent && (
            <tr className="border-t border-black">
              <td className="w-4"></td>
              <th className="text-left">Saturated Fat {nutrients.saturatedFatContent}</th>
              <td className="text-right font-bold">{calculateDailyValue(nutrients.saturatedFatContent, dailyValues.saturatedFatContent)}</td>
            </tr>
          )}
          {nutrients?.unsaturatedFatContent && (
            <tr className="border-t border-black">
              <td className="w-4"></td>
              <th className="text-left">Trans Fat {nutrients.unsaturatedFatContent}</th>
              <td></td>
            </tr>
          )}
          {nutrients?.cholesterolContent && (
            <tr className="border-t border-black">
              <th colSpan="2" className="font-bold">Cholesterol {nutrients.cholesterolContent}</th>
              <td className="text-right font-bold">{calculateDailyValue(nutrients.cholesterolContent, dailyValues.cholesterolContent)}</td>
            </tr>
          )}
          {nutrients?.sodiumContent && (
            <tr className="border-t border-black">
              <th colSpan="2" className="font-bold">Sodium {nutrients.sodiumContent}</th>
              <td className="text-right font-bold">{calculateDailyValue(nutrients.sodiumContent, dailyValues.sodiumContent)}</td>
            </tr>
          )}
          {nutrients?.carbohydrateContent && (
            <tr className="border-t border-black">
              <th colSpan="2" className="font-bold">Total Carbohydrate {nutrients.carbohydrateContent}</th>
              <td className="text-right font-bold">{calculateDailyValue(nutrients.carbohydrateContent, dailyValues.carbohydrateContent)}</td>
            </tr>
          )}
          {nutrients?.fiberContent && (
            <tr className="border-t border-black">
              <td className="w-4"></td>
              <th className="text-left">Dietary Fiber {nutrients.fiberContent}</th>
              <td className="text-right font-bold">{calculateDailyValue(nutrients.fiberContent, dailyValues.fiberContent)}</td>
            </tr>
          )}
          {nutrients?.sugarContent && (
            <tr className="border-t border-black">
              <td className="w-4"></td>
              <th className="text-left">Sugars {nutrients.sugarContent}</th>
              <td></td>
            </tr>
          )}
          {nutrients?.proteinContent && (
            <tr className="border-b-4 border-t border-black">
              <th colSpan="2" className="font-bold">Protein {nutrients.proteinContent}</th>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>

      <p className="text-xs mt-2">* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs:</p>

      <table className="w-full text-xs border-t border-black mt-2">
        <thead>
          <tr>
            <td colSpan="2"></td>
            <th className="text-left">Calories:</th>
            <th className="text-right">2,000</th>
            <th className="text-right">2,500</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-black">
            <th colSpan="2" className="text-left">Total Fat</th>
            <td className="text-left">Less than</td>
            <td className="text-right">78g</td>
            <td className="text-right">97g</td>
          </tr>
          <tr className="border-t border-black">
            <td className="w-4"></td>
            <th className="text-left">Saturated Fat</th>
            <td className="text-left">Less than</td>
            <td className="text-right">20g</td>
            <td className="text-right">25g</td>
          </tr>
          <tr className="border-t border-black">
            <th colSpan="2" className="text-left">Cholesterol</th>
            <td className="text-left">Less than</td>
            <td className="text-right">300mg</td>
            <td className="text-right">300mg</td>
          </tr>
          <tr className="border-t border-black">
            <th colSpan="2" className="text-left">Sodium</th>
            <td className="text-left">Less than</td>
            <td className="text-right">2300mg</td>
            <td className="text-right">2300mg</td>
          </tr>
          <tr className="border-t border-black">
            <th colSpan="3" className="text-left">Total Carbohydrate</th>
            <td className="text-right">275g</td>
            <td className="text-right">344g</td>
          </tr>
          <tr className="border-t border-black">
            <td className="w-4"></td>
            <th colSpan="2" className="text-left">Dietary Fiber</th>
            <td className="text-right">28g</td>
            <td className="text-right">35g</td>
          </tr>
        </tbody>
      </table>

      <p className="text-xs mt-2">Calories per gram:</p>
      <p className="text-xs text-center">
        Fat 9 &bull; Carbohydrate 4 &bull; Protein 4
      </p>
    </section>
  );
};

export default NutritionalInfo;
