sum = 0
f = nil
l = nil

File.open(ARGV[0]) do |file|
  file.each_line do |line|
    f = line[0..18] unless f
    l = line[0..18]

    if line.match(/Profit is (\d+)\./)
      sum += $1.to_i
    end
  end
end

puts "Start at #{f}"
puts "End at #{l}"
puts "Total profit is #{sum}."
