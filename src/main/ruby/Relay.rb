require './src/main/ruby/BattleShip_v2.rb'
require 'json'

class Relay

  def initialize
    @battleShip = BattleShip_v2.new
    @position = ""
    @attack_statement
    @attack_flag = "false"
  end

  def put_fleet(data)
    cnvLinkedHashMap2Hash(data).each do |hash|
      @battleShip.set_ship(hash)
    end
  end

  def console_view(_)
      @battleShip.view
  end

  def get_position(_)
    return @battleShip.position_code
  end

  def action_possible_area
    return @battleShip.action_possible_area.to_json
  end

  def attack(position_data)
    cnvLinkedHashMap2Hash(position_data).each do |hash|
      statement = @battleShip.attack(hash)
      return statement.to_json
    end
  end

  def move(position_data)
    cnvLinkedHashMap2Hash(position_data).each do |hash|
      @battleShip.move(hash)
      return { :action=>"move" }.to_json
    end
  end

  ######################
  #####　以下CPU用 #####
  #####################

  def auto_put
    positions = (0..24).to_a.sort_by {rand}[0..2]
    3.times do |i|
      data = {id: i, position: [positions[i]/5, positions[i]%5]}
      @battleShip.set_ship(data)
    end
  end

  def cpu_action(n)
    action_status = @battleShip.cpu_action(n.to_i)
    @attack_flag = "true" if action_status[:action]=='attack'
    return action_status.to_json
  end

  def cpu_attack(position_data)
    data = symbolize_keys(cnvLinkedHashMap2Hash(position_data))
    return data.to_json if data[:action]=='move'
    return @battleShip.attack(data).to_json
  end

  ### コンバーター ###
  def cnvLinkedHashMap2Hash(linkedHashMap)
    begin
      linkedHashMap.each do|key, value|
        return eval(key)
      end
    rescue
      p JSON.parse(linkedHashMap)
      return JSON.parse(linkedHashMap)
    end
    return false
  end

  #　ハッシュのキーを文字列からシンボルに変換
  def symbolize_keys(hash)
    hash.map{|k,v| [k.to_sym, v] }.to_h
  end

  ### デバッグ用 ###
  def say
    puts "hello"
  end

end

relay = Relay.new