export default function Activities({ data, handleChange }) {
  const { activity, actNo, id } = data

  return (
    <tr
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
      key={id}
    >
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 dark:text-white w-7/12"
      >
        {activity}
      </th>
      <td className="px-4 py-4">
        <input type="radio" name={actNo} value="0" onChange={handleChange} />
      </td>
      <td className="px-4 py-4">
        <input type="radio" name={actNo} value="0.25" onChange={handleChange} />
      </td>
      <td className="px-4 py-4">
        <input type="radio" name={actNo} value="0.5" onChange={handleChange} />
      </td>
      <td className="px-4 py-4">
        <input type="radio" name={actNo} value="1" onChange={handleChange} />
      </td>
    </tr>
  )
}
