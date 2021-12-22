require './src/main/ruby/Fleet.rb'

class BattleShip_v2

	attr_reader :MAP_HEIGHT, :MAP_WIDTH, :Ship1, :Ship2, :Ship3

	def initialize
		#
		@MAP_WIDTH = 5
		@MAP_HEIGHT = 5
		@map = Array.new(@MAP_HEIGHT).map{Array.new(@MAP_WIDTH, "・")}

		@Ship1 = Fleet.new(0, "Warship", 1, 7)#3
		@Ship2 = Fleet.new(1, "Destroyer", 1, 3)#2
		@Ship3 = Fleet.new(2, "Submarine", 1, 1)
    @random = Random.new()
  end

  def status
    data = []
    3.times do |i|
      fleet = fleet_for_id(i)
      data << {
          id: fleet.id,
          type: fleet.type,
          hp: fleet.hp,
          bullet: fleet.bullet
      }
    end
    return data
  end

  def game_end?
    destroy_cnt = 0
    3.times do |i|
      if destroy?(i)
        destroy_cnt += 1
      else
        unless has_bullet?(i)
          destroy_cnt += 1
        end
      end
    end
    return true if destroy_cnt>=3
    return false
  end

	def fleet_for_id(id)
		case id
		when 0
			return @Ship1
		when 1
			return @Ship2
		when 2
			return @Ship3
		end
	end

	def view
		@map.each { |y| y.each{|x|print(x," ")}; puts }
	end

	def set_ship(data)
		p data
		@map[data[:position][0]][data[:position][1]] = data[:id]
		fleet = fleet_for_id(data[:id])
		#raise ArgumentError, "fleet id が無効です" if fleet==nil
		fleet.x = data[:position][1]
		fleet.y = data[:position][0]
	end

	#
	# ステータスコードの意味
	# 0: 何も無し
	# 1: 水しぶき発生
	# 2: 魚雷命中
	#
	# フォーマット
	# 0 : 何もなし
	# 1 : 水しぶき発生
	# 210-1 : 水しぶき発生、1と0に魚雷命中
	def attack(position)
		y, x = position[:position][0], position[:position][1]
		status = { :action=>'attack', :hit=>-1, :destroy=>false, :splash=>false , :game_end=>false}
		if x > @MAP_WIDTH-1 or y > @MAP_HEIGHT-1 then
			puts "範囲外です"
			return
		end
		for id in 0..2 do
			fleet = fleet_for_id(id)
			if @map[y][x]==id
				puts "#{fleet.type}に魚雷が被弾"
				status[:hit] = fleet.id
				if fleet.hit
					x, y = position(id)
					@map[y][x] = '・'
					status[:destroy] = true
				end
				next
			end
			for i in -1..1 do
				for j in -1..1 do
					next if j+x>=@MAP_WIDTH or i+y>=@MAP_HEIGHT
					next if i==0 and j==0
					if @map[y+i][x+j]==id
						puts "#{fleet.type}周辺に水しぶき発生"
						status[:splash] = true
						next
					end
				end
			end
    end
    status[:game_end] = game_end?
		return status
	end

	def already_put_position?(x, y)
		for i in 1..3 do
			wx,wy = position(i)
			if x == wx and y == wy then
				puts "配置箇所が重複しています"
				return true
			end
		end
		return false
	end

	def move(data)
		id = data[:id]
		y, x = data[:position][0], data[:position][1]
		return false if already_put_position?(x, y)
    return if destroy?(id)
		wx,wy = position(id)
		if x == wx or y == wy then
			puts "移動しました"
			@map[wy][wx] = "・"
			@map[y][x] = id
			fleet = fleet_for_id(id)
			fleet.x = x
			fleet.y = y
			return true
		else
			#puts "現在地の縦横しか移動できません"
			return false
		end
		#
	end

	def attack_possible_area(id)
    #return {id: id, positions: []} if destroy?(id)
		raise Exception if destroy?(id)
		positions = []

		x,y = position(id)
		xy2, xy3 = other_position(id)
		for i in -1..1 do
		  next if y+i<0 or y+i>4
			for j in -1..1 do
				next if x+j<0 or x+j>4
				next if i==0 and j==0
				next if x+j==xy2[0] and y+i==xy2[1]
				next if x+j==xy3[0] and y+i==xy3[1]
        positions << [y+i, x+j]
			end
		end
		return {id: id, positions: positions}
	end

	def move_possible_area(id)
    return "" if destroy?(id)
		positions = []

		x,y = position(id)
		xy2, xy3 = other_position(id)
		5.times do |i|
			5.times do |j|
				next if y==i and x==j
				next if xy2[1]==i and xy2[0]==j
				next if xy3[1]==i and xy3[0]==j
				if x == j or y == i then
					positions << [i, j]
				end
			end
		end
		return {id: id, positions: positions}
	end

	def action_possible_area
		a_data = []
		m_data = []
		3.times do |i|
			if destroy?(i)
				a_data << []
				m_data << []
				next
			end
			a_data << attack_possible_area(i)
			m_data << move_possible_area(i)
		end
		return { attack: a_data, move: m_data }
	end

	def position(fleet_id)
		return @map.each_with_index{|v,y| return v.index(fleet_id),y if v.index(fleet_id)}
	end

	def other_position(id)
		positions = []
		3.times do |i|
			next if i==id
			positions << position(i)
		end
		return positions
	end

  def cpu_action(n)
      action_status = {}
      fleet = []
      3.times do |i|
        fleet << i if has_bullet?(i) and !destroy?(i)
      end
      if fleet.size==0
        n=10
        3.times do |i|
          fleet << i if !destroy?(i)
        end
			end
			raise Exception if fleet.size==0
      action_fleet_id = fleet.sample
			print "action fleet id = \"#{action_fleet_id}\" in \"cpu_action\" method"

      # attack
      if n <= 5
        fleet_for_id(action_fleet_id).attack
        list = attack_possible_area(action_fleet_id)
        pos = list[:positions].sample
				action_status = {
						action: 'attack',
						fleetId: action_fleet_id,
						position: pos
				}
      # move
      else
        list = move_possible_area(action_fleet_id)
        pos = list[:positions].sample
        pos_old = position(action_fleet_id)

        y_defference = pos[0] - pos_old[1]
        x_defference = pos[1] - pos_old[0]
        east_or_west = "east"
        north_or_south = "south"
        if x_defference<0
          east_or_west = "west"
          x_defference *= -1
        elsif y_defference<0
          north_or_south = "north"
          y_defference *= -1
        end
        if y_defference==0
					action_status = {
              action: 'move',
							fleetId: action_fleet_id,
							axis: east_or_west,
							moveLength: x_defference
					}
        else
					action_status = {
              action: 'move',
							fleetId: action_fleet_id,
							axis: north_or_south,
							moveLength: y_defference
					}
        end
        move({id: action_fleet_id, position: pos})
      end
      return action_status
  end

  def destroy?(id)
    fleet = fleet_for_id(id)
    return true if fleet.hp<=0
    return false
  end

  def has_bullet?(id)
    fleet = fleet_for_id(id)
    return false if fleet.bullet<=0
    return true
  end

	private :position, :other_position

end



__END__

def start_game(def_)
	player1 = BattleShip.new
	for i in 1..3 do
		fleet = player1.fleet_for_id(i)
		puts "set #{fleet.type} position"
		x = gets.to_i
		y = gets.to_i
		player1.set_ship(i,x,y)
	end
	player1.view
	loop do
		print "0:攻撃 1:移動\nコマンド選択:"
		cmd = gets.to_i
		case cmd
		when 0
			x = gets.to_i
			y = gets.to_i
			player1.attack(x,y)
		when 1
			puts "1:戦艦 2:駆逐艦 3:潜水艦"
			print "行動艦選択:"
			id = gets.to_i
			x = gets.to_i
			y = gets.to_i
			player1.move(id,x,y)
		end
		player1.view
	end
end

マスに戦艦を配置
行動→移動or攻撃
攻撃→マス指定→ヒットか調べる→ヒットなら撃沈→ゲーム終了
移動→マス指定